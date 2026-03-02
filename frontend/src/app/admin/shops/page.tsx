'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface Shop {
    _id: string;
    name: string;
    area: string;
    phone: string;
    isActive: boolean;
    categories: any[];
}

export default function AdminShopsPage() {
    const { data: session } = useSession();
    const token = (session?.user as any)?.backendToken;

    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingShop, setEditingShop] = useState<Shop | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        area: '',
        phone: '',
        isActive: true
    });

    const fetchShops = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/shops`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setShops(data.shops);
            }
        } catch (error) {
            toast.error('Failed to fetch shops');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, [token]);

    const handleOpenModal = (shop: Shop | null = null) => {
        if (shop) {
            setEditingShop(shop);
            setFormData({
                name: shop.name,
                area: shop.area,
                phone: shop.phone,
                isActive: shop.isActive
            });
        } else {
            setEditingShop(null);
            setFormData({
                name: '',
                area: '',
                phone: '',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingShop
                ? `${process.env.NEXT_PUBLIC_API_URL}/shops/${editingShop._id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/shops`;

            const method = editingShop ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                toast.success(editingShop ? 'Shop updated' : 'Shop created');
                setIsModalOpen(false);
                fetchShops();
            } else {
                toast.error(data.message || 'Operation failed');
            }
        } catch (err) {
            toast.error('An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this shop?')) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shops/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Shop deleted');
                fetchShops();
            } else {
                toast.error(data.message || 'Deletion failed');
            }
        } catch (err) {
            toast.error('Error deleting shop');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground font-bangla">Partnered Shops</h1>
                    <p className="text-sm text-muted-foreground">Manage partnered local shops</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                    <Plus size={18} /> Add Shop
                </button>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/40 text-muted-foreground text-sm border-b border-border">
                            <th className="px-6 py-4 font-semibold">Shop Name</th>
                            <th className="px-6 py-4 font-semibold">Contact & Area</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="text-center py-10">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                </td>
                            </tr>
                        ) : shops.length > 0 ? (
                            shops.map((shop) => (
                                <tr key={shop._id} className="hover:bg-muted/30">
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        {shop.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-foreground">{shop.phone}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <MapPin size={12} /> {shop.area}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${shop.isActive ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'}`}>
                                            {shop.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(shop)} className="text-blue-500 hover:text-blue-700 p-1">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(shop._id)} className="text-red-500 hover:text-red-700 p-1">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-muted-foreground">
                                    No shops found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4 text-foreground">{editingShop ? 'Edit Shop' : 'Add New Shop'}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Shop Name</label>
                                <input
                                    type="text" required
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 font-bangla text-foreground"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Area / Location</label>
                                <input
                                    type="text" required
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 font-bangla text-foreground"
                                    value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                                <input
                                    type="tel" required
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 text-foreground"
                                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <label className="flex items-center space-x-2 cursor-pointer mt-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="rounded text-red-600 focus:ring-red-500 bg-background border-border"
                                />
                                <span className="text-sm font-medium text-foreground">Active Status</span>
                            </label>

                            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-border">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Save Shop</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
