'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
    _id: string;
    nameBn: string;
    nameEn: string;
    categoryId: any;
    unit: string;
    priceGuide: { min: number; max: number };
    image: string;
    isPopular: boolean;
    isActive: boolean;
    orderCount: number;
}

interface Category {
    _id: string;
    nameBn: string;
    nameEn: string;
}

export default function AdminProductsPage() {
    const { data: session } = useSession();
    const token = (session?.user as any)?.backendToken;

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        nameBn: '',
        nameEn: '',
        categoryId: '',
        unit: 'kg',
        priceGuideMin: 0,
        priceGuideMax: 0,
        image: '',
        isPopular: false,
        isActive: true
    });

    const fetchData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            const prodData = await prodRes.json();
            const catData = await catRes.json();

            if (prodData.success) setProducts(prodData.products);
            if (catData.success) setCategories(catData.categories);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleOpenModal = (product: Product | null = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                nameBn: product.nameBn,
                nameEn: product.nameEn,
                categoryId: product.categoryId?._id || '',
                unit: product.unit || 'kg',
                priceGuideMin: product.priceGuide?.min || 0,
                priceGuideMax: product.priceGuide?.max || 0,
                image: product.image || '',
                isPopular: product.isPopular,
                isActive: product.isActive
            });
        } else {
            setEditingProduct(null);
            setFormData({
                nameBn: '',
                nameEn: '',
                categoryId: categories[0]?._id || '',
                unit: 'kg',
                priceGuideMin: 0,
                priceGuideMax: 0,
                image: '',
                isPopular: false,
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                nameBn: formData.nameBn,
                nameEn: formData.nameEn,
                categoryId: formData.categoryId,
                unit: formData.unit,
                priceGuide: { min: formData.priceGuideMin, max: formData.priceGuideMax },
                image: formData.image,
                isPopular: formData.isPopular,
                isActive: formData.isActive
            };

            const url = editingProduct
                ? `${process.env.NEXT_PUBLIC_API_URL}/products/${editingProduct._id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/products`;

            const method = editingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                toast.success(editingProduct ? 'Product updated' : 'Product created');
                setIsModalOpen(false);
                fetchData();
            } else {
                toast.error(data.message || 'Operation failed');
            }
        } catch (err) {
            toast.error('An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Product deleted');
                fetchData();
            } else {
                toast.error(data.message || 'Deletion failed');
            }
        } catch (err) {
            toast.error('Error deleting product');
        }
    };

    const toggleStatus = async (id: string, field: 'isActive' | 'isPopular', currentValue: boolean) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: !currentValue })
            });
            if (res.ok) {
                toast.success('Product updated');
                fetchData();
            }
        } catch (err) {
            toast.error('Failed to update product');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground font-bangla">Products</h1>
                    <p className="text-sm text-muted-foreground">Manage products, pricing guides, and grocery sync</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/40 text-muted-foreground text-sm border-b border-border">
                                <th className="px-6 py-4 font-semibold">Product</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Unit & Price Guide</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Flags</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                    </td>
                                </tr>
                            ) : products.length > 0 ? (
                                products.map((prod) => (
                                    <tr key={prod._id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {prod.image ? (
                                                    <img src={prod.image} alt="" className="w-10 h-10 rounded-md object-cover bg-muted" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                                                        <ImageIcon size={20} />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bangla font-medium text-foreground">{prod.nameBn}</p>
                                                    <p className="text-xs text-muted-foreground">{prod.nameEn}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {prod.categoryId?.nameBn || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">Per {prod.unit}</div>
                                            <div className="text-xs text-muted-foreground">৳{prod.priceGuide?.min} - ৳{prod.priceGuide?.max}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(prod._id, 'isActive', prod.isActive)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${prod.isActive ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'}`}
                                            >
                                                {prod.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(prod._id, 'isPopular', prod.isPopular)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${prod.isPopular ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
                                            >
                                                {prod.isPopular ? 'Popular' : 'Normal'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => handleOpenModal(prod)} className="text-blue-500 hover:text-blue-700 p-1">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(prod._id)} className="text-red-500 hover:text-red-400 p-1">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-card text-foreground rounded-xl shadow-xl w-full max-w-2xl p-6 border border-border" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Bengali Name</label>
                                    <input
                                        type="text" required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 font-bangla"
                                        value={formData.nameBn} onChange={e => setFormData({ ...formData, nameBn: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">English Name</label>
                                    <input
                                        type="text" required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500"
                                        value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                                    <select
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 font-bangla"
                                        value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.nameBn} ({cat.nameEn})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Unit Type (kg, pc, ltr)</label>
                                    <input
                                        type="text" required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500"
                                        value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Price Guide (Min ৳)</label>
                                    <input
                                        type="number" required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500"
                                        value={formData.priceGuideMin} onChange={e => setFormData({ ...formData, priceGuideMin: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Price Guide (Max ৳)</label>
                                    <input
                                        type="number" required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500"
                                        value={formData.priceGuideMax} onChange={e => setFormData({ ...formData, priceGuideMax: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
                                <input
                                    type="url"
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500"
                                    value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="flex space-x-6 mt-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="rounded text-red-600 focus:ring-red-500 bg-background border-border"
                                    />
                                    <span className="text-sm font-medium text-foreground">Active (Visible)</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isPopular}
                                        onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
                                        className="rounded text-red-600 focus:ring-red-500 bg-background border-border"
                                    />
                                    <span className="text-sm font-medium text-foreground">Mark as Popular</span>
                                </label>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-border">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
