'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ShoppingCart, Users, Bike, DollarSign, Package } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface DashboardStats {
    totalOrders: number;
    todayOrders: number;
    activeOrders: number;
    totalCustomers: number;
    totalRiders: number;
    availableRiders: number;
    totalRevenue: number;
    deliveredOrders: number;
}

interface Order {
    _id: string;
    userId: { name: string; phone: string };
    riderId?: { name: string };
    status: string;
    total: number;
    createdAt: string;
}

export default function AdminDashboard() {
    const { data: session } = useSession();
    const token = (session?.user as any)?.backendToken;

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchDashboardData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                    setRecentOrders(data.recentOrders);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token]);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div></div>;
    }

    if (!stats) {
        return <div className="text-center text-red-500">Failed to load dashboard statistics.</div>;
    }

    const statCards = [
        { title: "Today's Orders", value: stats.todayOrders, icon: ShoppingCart, color: "bg-blue-500" },
        { title: "Active Orders", value: stats.activeOrders, icon: Package, color: "bg-yellow-500" },
        { title: "Total Revenue", value: `৳${stats.totalRevenue}`, icon: DollarSign, color: "bg-green-500" },
        { title: "Total Customers", value: stats.totalCustomers, icon: Users, color: "bg-purple-500" },
        { title: "Available Riders", value: `${stats.availableRiders} / ${stats.totalRiders}`, icon: Bike, color: "bg-cyan-500" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'placed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400';
            case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400';
            case 'on_the_way': return 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400';
            case 'almost_there': return 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400';
            case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const formatStatusName = (status: string) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground font-bangla">Dashboard Overview</h1>
                <p className="text-sm text-muted-foreground">Real-time stats for QuickDeli platform.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-card rounded-xl shadow-sm p-6 border border-border flex items-center justify-between transition-transform duration-200 hover:scale-[1.02]">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">{card.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-full ${card.color} text-white flex items-center justify-center shadow-inner`}>
                            <card.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20">
                    <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/40 text-muted-foreground text-sm">
                                <th className="px-6 py-3 font-semibold">Order ID</th>
                                <th className="px-6 py-3 font-semibold">Customer</th>
                                <th className="px-6 py-3 font-semibold">Date</th>
                                <th className="px-6 py-3 font-semibold">Status</th>
                                <th className="px-6 py-3 font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-sm">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                            {order._id.substring(order._id.length - 6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{order.userId?.name || 'Unknown'}</div>
                                            <div className="text-muted-foreground text-xs">{order.userId?.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {formatStatusName(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            ৳{order.total}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No recent orders found.
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
