'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { MapPin, Navigation, Package, ArrowLeft } from 'lucide-react';
import LiveTrackingMap from '@/components/shared/LiveTrackingMap';

export default function TrackOrderPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const token = (session?.user as any)?.backendToken;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token || !id) return;

        const fetchOrder = async () => {
            try {
                // If the user is admin, they can access /api/admin/orders, 
                // but tracking is typically /api/orders/:id. 
                // Using general orders endpoint assuming rider/user/admin can access their authorized order
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();

                if (data.success) {
                    setOrder(data.order);
                } else {
                    toast.error(data.message || 'Order not found or unauthorized');
                    // Fallback to admin tracking api if regular tracking fails and user is admin
                    if ((session?.user as any)?.role === 'admin') {
                        const adminRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const adminData = await adminRes.json();
                        if (adminData.success) {
                            const found = adminData.orders.find((o: any) => o._id === id);
                            if (found) setOrder(found);
                        }
                    } else {
                        router.push('/');
                    }
                }
            } catch (error) {
                toast.error('Failed to load tracking data');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, token, router, session]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
                <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                <button onClick={() => router.back()} className="text-blue-500 hover:underline">Go Back</button>
            </div>
        );
    }

    // Default coordinates (e.g. Dhaka) if not exist
    const dhakaCenter = { lat: 23.8103, lng: 90.4125 };

    // In a real app, order should have customer location coordinates saved (deliveryAddress.coordinates)
    // and riderId object should have currentLocation. 
    // We will simulate it if it doesn't exist for demonstration.
    const customerLocation = order.deliveryAddress?.location || { lat: 23.7940, lng: 90.4043 }; // Banani approx
    let initialRiderLocation = order.riderId?.currentLocation || { lat: 23.8115, lng: 90.4120 }; // Baridhara approx

    const userRole = (session?.user as any)?.role;
    const isTrackingActive = userRole === 'admin'
        ? true
        : ['on_the_way', 'almost_there'].includes(order.status);

    return (
        <div className="min-h-screen bg-background pb-10">
            {/* Header */}
            <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-full transition text-foreground">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="font-bold text-lg text-foreground font-bangla">Live Track Order</h1>
                    </div>
                    <div className="text-sm font-mono text-muted-foreground">#{order._id.substring(order._id.length - 8).toUpperCase()}</div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Map Section */}
                <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border p-2">
                    {isTrackingActive ? (
                        <div className="relative rounded-xl overflow-hidden h-full">
                            <LiveTrackingMap
                                orderId={order._id}
                                customerLocation={customerLocation}
                                initialRiderLocation={initialRiderLocation}
                            />
                        </div>
                    ) : (
                        <div className="h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-xl border border-dashed border-border text-center p-6">
                            <Package className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-foreground mb-2">Tracking Not Available Yet</h3>
                            <p className="text-muted-foreground text-sm max-w-sm">
                                Live location will be available once the order is dispatched and the rider is on the way. Current Status: <span className="font-bold capitalize text-primary">{order.status.replace('_', ' ')}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                        <h2 className="font-bold text-lg text-foreground mb-4">Delivery Status</h2>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full animate-pulse ${isTrackingActive ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                <span className="font-semibold capitalize text-foreground">{order.status.replace(/_/g, ' ')}</span>
                            </div>
                            <span className="text-sm font-bold text-primary">৳{order.total}</span>
                        </div>

                        {order.riderId ? (
                            <div className="mt-4 pt-4 border-t border-border flex items-center gap-4">
                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center border border-border shrink-0">
                                    <span className="text-xl">🛵</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-muted-foreground mb-0.5">Your Rider</p>
                                    <p className="font-bold text-foreground truncate">{order.riderId.name}</p>
                                    <p className="text-sm font-mono text-muted-foreground">{order.riderId.phone}</p>
                                </div>
                                <a href={`tel:${order.riderId.phone}`} className="p-3 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-500/30 transition shrink-0">
                                    📞
                                </a>
                            </div>
                        ) : (
                            <div className="mt-4 pt-4 border-t border-border flex items-center justify-center py-2 text-sm text-muted-foreground bg-muted/40 rounded-lg">
                                Rider is waiting to be assigned
                            </div>
                        )}
                    </div>

                    <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                        <h2 className="font-bold text-lg text-foreground mb-4">Delivery Details</h2>

                        <div className="flex gap-3 mb-4">
                            <MapPin className="text-primary mt-0.5 shrink-0" size={18} />
                            <div>
                                <p className="text-sm font-medium text-foreground mb-1">Delivery Address</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {order.deliveryAddress?.flat || ''} {order.deliveryAddress?.address || 'Banani, Road 11, Block E'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-border">
                            <Navigation className="text-primary mt-0.5 shrink-0" size={18} />
                            <div>
                                <p className="text-sm font-medium text-foreground mb-1">Customer Info</p>
                                <p className="text-sm text-muted-foreground">
                                    {order.userId?.name || 'Customer'}<br />
                                    {order.userId?.phone || '01XXXXXXX'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
