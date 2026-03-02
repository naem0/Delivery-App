'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ShieldAlert, ShieldCheck, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface User {
    _id: string;
    name: string;
    phone: string;
    email: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminCustomersPage() {
    const { data: session } = useSession();
    const token = (session?.user as any)?.backendToken;

    const [customers, setCustomers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/customers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setCustomers(data.customers);
            }
        } catch (error) {
            toast.error('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [token]);

    const toggleAction = async (id: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'block' : 'unblock'} this user?`)) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/customers/${id}/toggle`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Customer ${currentStatus ? 'blocked' : 'unblocked'} successfully`);
                fetchCustomers();
            } else {
                toast.error(data.message || 'Action failed');
            }
        } catch (error) {
            toast.error('Error toggling customer status');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground font-bangla">Customers</h1>
                <p className="text-sm text-muted-foreground">View and manage customer accounts</p>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/40 text-muted-foreground text-sm border-b border-border">
                                <th className="px-6 py-4 font-semibold">Customer Details</th>
                                <th className="px-6 py-4 font-semibold">Contact</th>
                                <th className="px-6 py-4 font-semibold">Joined At</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                    </td>
                                </tr>
                            ) : customers.length > 0 ? (
                                customers.map((user) => (
                                    <tr key={user._id} className="hover:bg-muted/30 border-b border-border">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{user.name || 'No Name Provided'}</div>
                                            <div className="text-xs text-muted-foreground font-mono mt-1">ID: {user._id.substring(user._id.length - 8)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{user.phone}</div>
                                            {user.email && (
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                    <Mail size={12} /> {user.email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {format(new Date(user.createdAt), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'}`}>
                                                {user.isActive ? 'Active' : 'Blocked'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => toggleAction(user._id, user.isActive)}
                                                className={`flex items-center gap-2 justify-end ml-auto px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${user.isActive
                                                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10'
                                                    : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10'
                                                    }`}
                                            >
                                                {user.isActive ? (
                                                    <><ShieldAlert size={16} /> Block</>
                                                ) : (
                                                    <><ShieldCheck size={16} /> Unblock</>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
