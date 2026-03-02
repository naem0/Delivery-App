'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, Edit2, ShieldOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface Rider {
    _id: string;
    name: string;
    phone: string;
    zone: string;
    isAvailable: boolean;
    rating: number;
}

export default function AdminRidersPage() {
    const { data: session } = useSession();
    const token = (session?.user as any)?.backendToken;

    const [riders, setRiders] = useState<Rider[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRider, setEditingRider] = useState<Rider | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        zone: '',
        isAvailable: true
    });

    const fetchRiders = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/riders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setRiders(data.riders);
            }
        } catch (error) {
            toast.error('Failed to fetch riders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiders();
    }, [token]);

    const handleOpenModal = (rider: Rider | null = null) => {
        if (rider) {
            setEditingRider(rider);
            setFormData({
                name: rider.name,
                phone: rider.phone,
                zone: rider.zone,
                isAvailable: rider.isAvailable
            });
        } else {
            setEditingRider(null);
            setFormData({
                name: '',
                phone: '',
                zone: '',
                isAvailable: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingRider
                ? `${process.env.NEXT_PUBLIC_API_URL}/riders/${editingRider._id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/riders`;

            const method = editingRider ? 'PUT' : 'POST';

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
                toast.success(editingRider ? 'Rider updated' : 'Rider added');
                setIsModalOpen(false);
                fetchRiders();
            } else {
                toast.error(data.message || 'Operation failed');
            }
        } catch (err) {
            toast.error('An error occurred');
        }
    };

    const toggleAvailability = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/riders/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ isAvailable: !currentStatus })
            });
            if (res.ok) {
                toast.success('Availability updated');
                fetchRiders();
            }
        } catch (err) {
            toast.error('Failed to update rider');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground font-bangla">Rider Management</h1>
                    <p className="text-sm text-muted-foreground">Manage delivery riders and zones</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                    <Plus size={18} /> Add Rider
                </button>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/40 text-muted-foreground text-sm border-b border-border">
                            <th className="px-6 py-4 font-semibold">Rider Info</th>
                            <th className="px-6 py-4 font-semibold">Zone</th>
                            <th className="px-6 py-4 font-semibold">Rating</th>
                            <th className="px-6 py-4 font-semibold">Availability</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                </td>
                            </tr>
                        ) : riders.length > 0 ? (
                            riders.map((rider) => (
                                <tr key={rider._id} className="hover:bg-muted/30">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-foreground">{rider.name}</div>
                                        <div className="text-xs text-muted-foreground font-mono">{rider.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-muted text-foreground px-2 py-1 rounded text-xs font-semibold">
                                            {rider.zone}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        ⭐ {rider.rating?.toFixed(1) || '0.0'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleAvailability(rider._id, rider.isAvailable)}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${rider.isAvailable ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                                                }`}
                                        >
                                            {rider.isAvailable ? 'Available' : 'Offline'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(rider)} className="text-blue-500 hover:text-blue-700 p-1">
                                            <Edit2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No riders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 border border-border" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4 text-foreground">{editingRider ? 'Edit Rider' : 'Add New Rider'}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                                <input
                                    type="text" required
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 font-bangla text-foreground"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Zone (e.g. Dhanmondi)</label>
                                <input
                                    type="text" required
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 font-bangla text-foreground"
                                    value={formData.zone} onChange={e => setFormData({ ...formData, zone: e.target.value })}
                                />
                            </div>
                            <label className="flex items-center space-x-2 cursor-pointer mt-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isAvailable}
                                    onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                                    className="rounded text-red-600 focus:ring-red-500 bg-background border-border"
                                />
                                <span className="text-sm font-medium text-foreground">Currently Available</span>
                            </label>

                            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-border">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Save Rider</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
