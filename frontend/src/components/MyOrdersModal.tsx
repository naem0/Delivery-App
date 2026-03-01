'use client';
import { useEffect, useState } from 'react';
import { X, PackageSearch, Clock, CheckCircle2, Truck, MapPin, Store, XCircle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api';

interface OrderItem {
    productNameEn: string;
    productNameBn: string;
    quantity: number;
    unit: string;
    unitBn: string;
    priceEstimate: number;
    isCustom: boolean;
}

interface StatusHistory {
    status: string;
    timestamp: string;
    note?: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    status: string;
    statusHistory: StatusHistory[];
    items: OrderItem[];
    subtotal: number;
    deliveryCharge: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    deliveryAddress: { text: string };
    createdAt: string;
    estimatedDeliveryTime?: string;
    riderId?: { name: string; phone: string };
}

interface MyOrdersModalProps {
    onClose: () => void;
    onLoginRequired: () => void;
}

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; colorClass: string; labelBn: string; labelEn: string }> = {
    placed: {
        icon: <Clock className="w-4 h-4" />,
        colorClass: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
        labelBn: '✅ অর্ডার গৃহীত',
        labelEn: '✅ Order Placed',
    },
    processing: {
        icon: <Store className="w-4 h-4" />,
        colorClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
        labelBn: '🔄 প্রক্রিয়াধীন',
        labelEn: '🔄 Processing',
    },
    on_the_way: {
        icon: <Truck className="w-4 h-4" />,
        colorClass: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
        labelBn: '🚴 ডেলিভারিতে',
        labelEn: '🚴 On the Way',
    },
    almost_there: {
        icon: <MapPin className="w-4 h-4" />,
        colorClass: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
        labelBn: '📍 প্রায় পৌঁছে গেছে',
        labelEn: '📍 Almost There',
    },
    delivered: {
        icon: <CheckCircle2 className="w-4 h-4" />,
        colorClass: 'text-green-500 bg-green-500/10 border-green-500/30',
        labelBn: '✅ ডেলিভারি সম্পন্ন',
        labelEn: '✅ Delivered',
    },
    cancelled: {
        icon: <XCircle className="w-4 h-4" />,
        colorClass: 'text-red-500 bg-red-500/10 border-red-500/30',
        labelBn: '❌ বাতিল',
        labelEn: '❌ Cancelled',
    },
};

const PROGRESS_STEPS = ['placed', 'processing', 'on_the_way', 'almost_there', 'delivered'];

function OrderCard({ order, isBn }: { order: Order; isBn: boolean }) {
    const [expanded, setExpanded] = useState(false);
    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['placed'];
    const isActive = !['delivered', 'cancelled'].includes(order.status);

    const activeStep = PROGRESS_STEPS.indexOf(order.status);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleString(isBn ? 'bn-BD' : 'en-US', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div className={`bg-card border rounded-2xl overflow-hidden transition-all ${isActive ? 'border-primary/30 shadow-lg shadow-primary/5' : 'border-border/50'}`}>
            {/* Active pulse line */}
            {isActive && (
                <div className="h-0.5 bg-gradient-to-r from-primary via-yellow-400 to-primary animate-pulse" />
            )}

            {/* Card Header */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-base font-black text-primary">#{order.orderNumber}</span>
                            {isActive && (
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <Badge className={`text-xs font-bold border rounded-xl px-3 py-1 ${cfg.colorClass}`}>
                        {isBn ? cfg.labelBn : cfg.labelEn}
                    </Badge>
                </div>

                {/* Progress Bar (only for non-cancelled orders) */}
                {order.status !== 'cancelled' && (
                    <div className="mb-3">
                        <div className="flex items-center gap-1">
                            {PROGRESS_STEPS.map((step, i) => {
                                const isCompleted = i <= activeStep;
                                const isCurrent = i === activeStep;
                                return (
                                    <div key={step} className="flex items-center flex-1">
                                        <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 transition-all ${isCompleted
                                            ? isCurrent
                                                ? 'bg-primary border-primary scale-125'
                                                : 'bg-primary border-primary'
                                            : 'bg-background border-border'
                                            }`} />
                                        {i < PROGRESS_STEPS.length - 1 && (
                                            <div className={`h-0.5 flex-1 transition-all ${i < activeStep ? 'bg-primary' : 'bg-border'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-[9px] text-muted-foreground">{isBn ? 'গৃহীত' : 'Placed'}</span>
                            <span className="text-[9px] text-muted-foreground">{isBn ? 'ডেলিভারি' : 'Delivered'}</span>
                        </div>
                    </div>
                )}

                {/* Quick info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{order.items.length} {isBn ? 'আইটেম' : 'items'} • ~৳{order.total}</span>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1 text-primary font-bold hover:underline"
                    >
                        {expanded ? (isBn ? 'কম দেখুন' : 'Less') : (isBn ? 'বিস্তারিত' : 'Details')}
                        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <>
                    <Separator />
                    <div className="p-4 space-y-3">
                        {/* Items */}
                        <div>
                            <p className="text-xs font-bold mb-2 text-muted-foreground">{isBn ? 'অর্ডারের আইটেম' : 'Order Items'}</p>
                            <div className="space-y-1.5">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {isBn ? item.productNameBn : item.productNameEn} × {item.quantity} {isBn ? item.unitBn : item.unit}
                                            {item.isCustom && <span className="ml-1 text-[10px] text-primary">(কাস্টম)</span>}
                                        </span>
                                        {item.priceEstimate > 0 && (
                                            <span className="font-bold text-primary">~৳{item.priceEstimate * item.quantity}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Delivery & Payment */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <p className="text-muted-foreground mb-0.5">{isBn ? 'ঠিকানা' : 'Address'}</p>
                                <p className="font-bold">{order.deliveryAddress?.text || '—'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-0.5">{isBn ? 'পেমেন্ট' : 'Payment'}</p>
                                <p className="font-bold uppercase">{order.paymentMethod}</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Price breakdown */}
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>{isBn ? 'সাবটোটাল' : 'Subtotal'}</span>
                                <span>~৳{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>{isBn ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
                                <span>৳{order.deliveryCharge}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base">
                                <span>{isBn ? 'মোট' : 'Total'}</span>
                                <span className="text-primary">~৳{order.total}</span>
                            </div>
                        </div>

                        {/* Status history */}
                        {order.statusHistory && order.statusHistory.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-xs font-bold mb-2 text-muted-foreground">{isBn ? 'অর্ডারের ইতিহাস' : 'Status History'}</p>
                                    <div className="space-y-2">
                                        {[...order.statusHistory].reverse().map((h, i) => {
                                            const hcfg = STATUS_CONFIG[h.status];
                                            return (
                                                <div key={i} className="flex items-start gap-2 text-xs">
                                                    <span className={`mt-0.5 ${hcfg?.colorClass?.split(' ')[0] || 'text-muted-foreground'}`}>
                                                        {hcfg?.icon}
                                                    </span>
                                                    <div>
                                                        <p className="font-bold">{isBn ? hcfg?.labelBn : hcfg?.labelEn}</p>
                                                        <p className="text-muted-foreground">{formatDate(h.timestamp)}</p>
                                                        {h.note && <p className="text-muted-foreground italic">{h.note}</p>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default function MyOrdersModal({ onClose, onLoginRequired }: MyOrdersModalProps) {
    const { language } = useApp();
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const isBn = language === 'bn';

    const fetchOrders = async (silent = false) => {
        if (status === 'loading') return;
        if (!session?.user) {
            if (!silent) onLoginRequired();
            return;
        }
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const res = await api.get('/orders?limit=20');
            setOrders(res.data.orders || []);
        } catch {
            // silent fail
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (status === 'loading') return;
        fetchOrders();
        // Auto-refresh every 30 seconds for active orders
        const interval = setInterval(() => fetchOrders(true), 30000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.id, status]);

    const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
    const pastOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end md:items-center md:justify-center md:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" onClick={onClose} />

            <div className="relative z-10 w-full md:max-w-lg animate-slide-up bg-card/90 backdrop-blur-2xl border border-white/15 shadow-2xl rounded-t-3xl md:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-400 to-primary rounded-t-3xl" />

                {/* Header */}
                <div className="flex items-center justify-between p-5 pb-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <PackageSearch className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold">{isBn ? 'আমার অর্ডার' : 'My Orders'}</h2>
                            <p className="text-[11px] text-muted-foreground">
                                {orders.length} {isBn ? 'টি অর্ডার' : 'total orders'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost" size="icon"
                            onClick={() => fetchOrders(true)}
                            disabled={refreshing}
                            className="rounded-full w-8 h-8 bg-secondary/50"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8 bg-secondary/50">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <RefreshCw className="w-8 h-8 animate-spin mb-3 text-primary" />
                            <p className="text-sm">{isBn ? 'লোড হচ্ছে...' : 'Loading orders...'}</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                <PackageSearch className="w-10 h-10 text-muted-foreground/40" />
                            </div>
                            <p className="font-bold text-muted-foreground">
                                {isBn ? 'কোনো অর্ডার নেই' : 'No orders yet'}
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                                {isBn ? 'অর্ডার করলে এখানে দেখা যাবে' : 'Your orders will appear here'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Active Orders */}
                            {activeOrders.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-widest text-primary">
                                            {isBn ? 'সক্রিয় অর্ডার' : 'Active Orders'}
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {activeOrders.map(o => (
                                            <OrderCard key={o._id} order={o} isBn={isBn} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Past Orders */}
                            {pastOrders.length > 0 && (
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
                                        {isBn ? 'পুরানো অর্ডার' : 'Past Orders'}
                                    </p>
                                    <div className="space-y-3">
                                        {pastOrders.map(o => (
                                            <OrderCard key={o._id} order={o} isBn={isBn} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
