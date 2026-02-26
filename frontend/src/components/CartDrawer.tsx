'use client';
import { X, Trash2, ShoppingBag, MapPin, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface CartDrawerProps {
    onClose: () => void;
    onLoginRequired: () => void;
}

export default function CartDrawer({ onClose, onLoginRequired }: CartDrawerProps) {
    const { cart, removeFromCart, clearCart, cartTotal, user, language, t } = useApp();
    const [address, setAddress] = useState('');
    const [placing, setPlacing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');
    const isBn = language === 'bn';

    const DELIVERY_CHARGE = 40;
    const grandTotal = cartTotal + DELIVERY_CHARGE;

    const handlePlaceOrder = async () => {
        if (!user) { onLoginRequired(); return; }
        if (!address.trim()) {
            toast.error(isBn ? 'ডেলিভারি ঠিকানা দিন' : 'Enter delivery address');
            return;
        }
        if (cart.length === 0) {
            toast.error(isBn ? 'কার্ট খালি' : 'Cart is empty');
            return;
        }
        setPlacing(true);
        try {
            const res = await api.post('/orders', {
                items: cart, deliveryAddress: { text: address },
                paymentMethod, subtotal: cartTotal,
            });
            toast.success(isBn
                ? `✅ অর্ডার সম্পন্ন! #${res.data.order.orderNumber}`
                : `✅ Order placed! #${res.data.order.orderNumber}`
            );
            clearCart();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setPlacing(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end md:items-center md:justify-center md:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" onClick={onClose} />

            {/* Drawer / Modal */}
            <div className="relative z-10 w-full md:max-w-lg animate-slide-up bg-card/90 backdrop-blur-2xl border border-white/15 shadow-2xl rounded-t-3xl md:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-primary to-yellow-400 rounded-t-3xl" />

                {/* Header */}
                <div className="flex items-center justify-between p-5 pb-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold">{t.cart}</h2>
                            <p className="text-[11px] text-muted-foreground">{cart.length} {t.items}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {cart.length > 0 && (
                            <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive text-xs hover:bg-destructive/10 rounded-xl">
                                {isBn ? 'সব মুছুন' : 'Clear All'}
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8 bg-secondary/50">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
                            </div>
                            <p className="font-bold text-muted-foreground">{t.emptyCart}</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">{t.addItemsToStart}</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Cart items */}
                            <div className="space-y-3">
                                {cart.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-secondary/50 rounded-2xl p-3 border border-border/50">
                                        {/* Product Image */}
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={isBn ? item.productNameBn : item.productNameEn} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-5 h-5 text-muted-foreground/40" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold flex items-center gap-1.5">
                                                {isBn ? item.productNameBn : item.productNameEn}
                                                {item.isCustom && (
                                                    <Badge variant="outline" className="text-[8px] px-1.5 py-0 text-primary border-primary/30">
                                                        {isBn ? 'কাস্টম' : 'custom'}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                                {item.quantity} {isBn ? item.unitBn : item.unit}
                                                {item.shopPreference && ` • ${item.shopPreference}`}
                                            </p>
                                            {item.priceEstimate && item.priceEstimate > 0 && (
                                                <p className="text-xs text-primary font-bold mt-0.5">
                                                    ~৳{item.priceEstimate * item.quantity}
                                                </p>
                                            )}
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(index)} className="text-destructive hover:bg-destructive/10 rounded-xl w-8 h-8">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Delivery address */}
                            <div>
                                <label className="text-xs font-bold flex items-center gap-1.5 mb-2">
                                    <MapPin className="w-3.5 h-3.5 text-primary" />
                                    {t.deliveryAddress}
                                </label>
                                <Input
                                    placeholder={isBn ? 'বাসার ঠিকানা লিখুন...' : 'Enter your delivery address...'}
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    className="rounded-2xl bg-secondary/50 h-12"
                                />
                            </div>

                            {/* Payment method */}
                            <div>
                                <label className="text-xs font-bold mb-2 block">{t.paymentMethod}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['cod', 'bkash'] as const).map(method => (
                                        <button
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            className={`p-3 rounded-2xl border-2 text-sm font-bold transition-all ${paymentMethod === method
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/40'
                                                }`}
                                        >
                                            {method === 'cod' ? '💵 ক্যাশ অন ডেলিভারি' : '📱 bKash'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price summary */}
                            <Card className="bg-secondary/50 border-border/50">
                                <CardContent className="p-4 space-y-2">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>{t.subtotal}</span>
                                        <span>~৳{cartTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>{t.deliveryCharge}</span>
                                        <span>৳{DELIVERY_CHARGE}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-base font-extrabold">
                                        <span>{t.total}</span>
                                        <span className="text-primary">~৳{grandTotal}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Bottom action - always visible, never cut off */}
                {cart.length > 0 && (
                    <div className="flex-shrink-0 p-5 pt-3 border-t border-border/50 bg-card/50 backdrop-blur-sm">
                        <Button
                            onClick={handlePlaceOrder}
                            disabled={placing}
                            className="w-full h-14 bg-primary hover:bg-red-600 text-white font-bold rounded-2xl text-base shadow-lg shadow-primary/25"
                        >
                            {placing ? '...' : t.placeOrder}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
