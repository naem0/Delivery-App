'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
    _id: string;
    userId: { name: string; phone: string };
    riderId?: { name: string; phone: string; _id: string };
    status: string;
    total: number;
    items: any[];
    addressId: any;
    createdAt: string;
}

interface Rider {
    _id: string;
    name: string;
    phone: string;
    isAvailable: boolean;
}

export default function AdminOrdersPage() {
    const { data: session } = useSession();
    const token = (session?.user as any)?.backendToken;

    const [orders, setOrders] = useState<Order[]>([]);
    const [riders, setRiders] = useState<Rider[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const url = statusFilter ? `/api/admin/orders?status=${statusFilter}` : '/api/admin/orders';
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url.replace('/api', '')}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setOrders(data.orders);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchRiders = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/riders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            // Note: If /api/admin/riders not implemented, we might need a general riders endpoint
            if (data.success) setRiders(data.riders || []);
        } catch (error) {
            console.error('Failed to fetch riders');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token, statusFilter]);

    useEffect(() => {
        fetchRiders(); // For assignment dropdowns
    }, [token]);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Order status updated');
                fetchOrders();
            } else {
                toast.error(data.message || 'Update failed');
            }
        } catch (err) {
            toast.error('Error updating status');
        }
    };

    const handleAssignRider = async (orderId: string, riderId: string) => {
        // We'll need to create this API in backend if it doesn't exist
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/assign`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ riderId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Rider assigned successfully');
                fetchOrders();
            } else {
                toast.error(data.message || 'Assignment failed');
            }
        } catch (err) {
            toast.error('Error assigning rider');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'placed': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'on_the_way': return 'bg-purple-100 text-purple-800 border border-purple-200';
            case 'almost_there': return 'bg-orange-100 text-orange-800 border border-orange-200';
            case 'delivered': return 'bg-green-100 text-green-800 border border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground font-bangla">Order Management</h1>
                    <p className="text-sm text-muted-foreground">View and manage all customer orders</p>
                </div>

                <div className="flex bg-card rounded-lg p-1 border border-border shadow-sm">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-transparent text-sm font-medium focus:outline-none px-2 py-1 text-foreground"
                    >
                        <option value="">All Statuses</option>
                        <option value="placed">Placed</option>
                        <option value="processing">Processing</option>
                        <option value="on_the_way">On The Way</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/40 text-muted-foreground text-sm border-b border-border">
                                <th className="px-6 py-4 font-semibold">Order ID</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Total</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Rider</th>
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
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                            {order._id.substring(order._id.length - 8).toUpperCase()}
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{order.userId?.name}</div>
                                            <div className="text-xs text-muted-foreground">{order.userId?.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground">৳{order.total}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className={`text-xs font-semibold rounded-full px-3 py-1 outline-none cursor-pointer appearance-none ${getStatusColor(order.status)}`}
                                            >
                                                <option value="placed">Placed</option>
                                                <option value="processing">Processing</option>
                                                <option value="on_the_way">On The Way</option>
                                                <option value="almost_there">Almost There</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.riderId ? (
                                                <div className="text-sm">
                                                    <div className="font-medium text-foreground">{order.riderId.name}</div>
                                                    <div className="text-xs text-muted-foreground">{order.riderId.phone}</div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded border border-red-100 dark:border-red-500/20 font-medium">No Rider</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal (Placeholder) */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-card text-foreground rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                            <h2 className="text-xl font-bold font-bangla">Order #{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground font-bold text-xl">&times;</button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {/* Render items and address here */}
                            <h3 className="font-bold text-foreground border-b border-border pb-2 mb-4">Items:</h3>
                            <ul className="space-y-3">
                                {selectedOrder.items.map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-center text-sm">
                                        <div>
                                            <span className="font-medium">{item.product_name}</span>
                                            <div className="text-xs text-muted-foreground">Qty: {item.quantity} {item.unit} | Unit Price: ৳{item.price}</div>
                                        </div>
                                        <div className="font-bold">৳{item.quantity * item.price}</div>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-4 border-t border-border flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span>৳{selectedOrder.total}</span>
                            </div>

                            {/* Assign Rider Section Placeholder */}
                            <div className="mt-8 pt-4 border-t border-border">
                                <h3 className="font-bold text-foreground mb-2">Assign Rider</h3>
                                <div className="flex gap-2">
                                    <select className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 text-foreground">
                                        <option value="">Select a rider...</option>
                                        {riders.map(r => (
                                            <option key={r._id} value={r._id}>{r.name} - {r.phone}</option>
                                        ))}
                                    </select>
                                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">Assign</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
