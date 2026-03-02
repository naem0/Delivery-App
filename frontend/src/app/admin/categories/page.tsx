'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
    _id: string;
    nameBn: string;
    nameEn: string;
    icon: string;
    sortOrder: number;
    isVisible: boolean;
}

export default function AdminCategoriesPage() {
    const { data: session } = useSession();
    const token = (session?.user as any)?.backendToken;

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        nameBn: '',
        nameEn: '',
        icon: '',
        sortOrder: 0,
        isVisible: true
    });

    const fetchCategories = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    const handleOpenModal = (category: Category | null = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                nameBn: category.nameBn,
                nameEn: category.nameEn,
                icon: category.icon || '',
                sortOrder: category.sortOrder,
                isVisible: category.isVisible
            });
        } else {
            setEditingCategory(null);
            setFormData({
                nameBn: '',
                nameEn: '',
                icon: '',
                sortOrder: categories.length + 1,
                isVisible: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingCategory
                ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${editingCategory._id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/categories`;

            const method = editingCategory ? 'PUT' : 'POST';

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
                toast.success(editingCategory ? 'Category updated' : 'Category created');
                setIsModalOpen(false);
                fetchCategories();
            } else {
                toast.error(data.message || 'Operation failed');
            }
        } catch (err) {
            toast.error('An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Category deleted');
                fetchCategories();
            } else {
                toast.error(data.message || 'Deletion failed');
            }
        } catch (err) {
            toast.error('Error deleting category');
        }
    };

    const toggleVisibility = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ isVisible: !currentStatus })
            });
            if (res.ok) {
                toast.success('Visibility updated');
                fetchCategories();
            }
        } catch (err) {
            toast.error('Failed to update visibility');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground font-bangla">Categories</h1>
                    <p className="text-sm text-muted-foreground">Manage your product categories</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/40 text-muted-foreground text-sm border-b border-border">
                            <th className="px-6 py-4 w-16"></th>
                            <th className="px-6 py-4 font-semibold">Icon</th>
                            <th className="px-6 py-4 font-semibold">Bengali Name</th>
                            <th className="px-6 py-4 font-semibold">English Name</th>
                            <th className="px-6 py-4 font-semibold">Visibility</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                </td>
                            </tr>
                        ) : categories.length > 0 ? (
                            categories.map((cat) => (
                                <tr key={cat._id} className="hover:bg-muted/30 group">
                                    <td className="px-6 py-4 text-muted-foreground cursor-move">
                                        <GripVertical size={18} />
                                    </td>
                                    <td className="px-6 py-4 text-2xl">
                                        {cat.icon || '📦'}
                                    </td>
                                    <td className="px-6 py-4 font-bangla text-foreground font-medium">
                                        {cat.nameBn}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {cat.nameEn}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleVisibility(cat._id, cat.isVisible)}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${cat.isVisible ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
                                        >
                                            {cat.isVisible ? 'Visible' : 'Hidden'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleOpenModal(cat)} className="text-blue-500 hover:text-blue-400 p-1">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:text-red-400 p-1">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-muted-foreground">
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-card text-foreground rounded-xl shadow-xl w-full max-w-md p-6 border border-border" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Icon (Emoji/URL)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500"
                                        value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Sort Order</label>
                                    <input
                                        type="number" required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500"
                                        value={formData.sortOrder} onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <label className="flex items-center space-x-2 cursor-pointer mt-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isVisible}
                                    onChange={e => setFormData({ ...formData, isVisible: e.target.checked })}
                                    className="rounded text-red-600 focus:ring-red-500 bg-background border-border"
                                />
                                <span className="text-sm font-medium text-foreground">Visible on App</span>
                            </label>

                            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-border">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Save Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
