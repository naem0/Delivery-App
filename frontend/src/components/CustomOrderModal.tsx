'use client';
import { useState } from 'react';
import { X, Plus, Trash2, ArrowRight, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface OrderItem {
    productId?: string;
    productNameEn: string;
    productNameBn: string;
    quantity: number;
    unit: string;
    unitBn: string;
    shopPreference?: string;
    priceEstimate?: number;
}

interface CustomOrderModalProps {
    onClose: () => void;
    onLoginRequired: () => void;
}

const UNITS = [
    { value: 'kg', label: 'কেজি (kg)' },
    { value: 'liter', label: 'লিটার (L)' },
    { value: 'piece', label: 'পিস' },
    { value: 'dozen', label: 'ডজন' },
    { value: 'gram', label: 'গ্রাম (g)' },
    { value: 'pack', label: 'প্যাক' },
];

export default function CustomOrderModal({ onClose, onLoginRequired }: CustomOrderModalProps) {
    const { t, user, addToCart, language } = useApp();
    const isBn = language === 'bn';
    const [items, setItems] = useState<OrderItem[]>([
        { productNameEn: '', productNameBn: '', quantity: 1, unit: 'kg', unitBn: 'কেজি' }
    ]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [searchTimeout, setSearchTimeout] = useState<any>(null);

    const handleSearch = async (query: string, index: number) => {
        if (searchTimeout) clearTimeout(searchTimeout);
        setActiveIndex(index);
        if (query.length < 1) { setSuggestions([]); return; }
        const timeout = setTimeout(async () => {
            try {
                const res = await api.get(`/products/suggestions?q=${encodeURIComponent(query)}`);
                setSuggestions(res.data.suggestions || []);
            } catch { setSuggestions([]); }
        }, 300);
        setSearchTimeout(timeout);
    };

    const selectSuggestion = (suggestion: any, index: number) => {
        const updated = [...items];
        updated[index] = {
            ...updated[index],
            productId: suggestion._id,
            productNameEn: suggestion.nameEn,
            productNameBn: suggestion.nameBn,
            unit: suggestion.unit,
            unitBn: suggestion.unitBn || suggestion.unit,
            priceEstimate: suggestion.priceGuide?.min || 0,
        };
        setItems(updated);
        setSuggestions([]);
        setActiveIndex(null);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const updated = [...items];
        (updated[index] as any)[field] = value;
        if (field === 'productNameBn') updated[index].productNameEn = value;
        setItems(updated);
    };

    const addItem = () => {
        setItems([...items, { productNameEn: '', productNameBn: '', quantity: 1, unit: 'kg', unitBn: 'কেজি' }]);
    };

    const removeItem = (index: number) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const handleAddAllToCart = () => {
        const validItems = items.filter(item => item.productNameBn.trim() || item.productNameEn.trim());
        if (validItems.length === 0) {
            toast.error(isBn ? 'কমপক্ষে একটি পণ্য যোগ করুন' : 'Add at least one item');
            return;
        }
        validItems.forEach(item => {
            addToCart({
                ...item,
                productNameEn: item.productNameEn || item.productNameBn,
                productNameBn: item.productNameBn || item.productNameEn,
                isCustom: !item.productId,
            });
        });
        toast.success(isBn ? `${validItems.length}টি পণ্য কার্টে যোগ হয়েছে` : `${validItems.length} items added to cart`);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end md:items-center md:justify-center md:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full md:max-w-lg animate-slide-up bg-card/90 backdrop-blur-2xl border border-white/15 shadow-2xl rounded-t-3xl md:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-400 to-primary rounded-t-3xl" />

                {/* Header */}
                <div className="flex items-center justify-between p-5 pb-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <span className="material-icons text-primary text-xl">edit_note</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold">{t.customOrder}</h2>
                            <p className="text-[11px] text-muted-foreground">
                                {isBn ? 'যা দরকার, লিখুন — আমরা পৌঁছে দেব' : "Write what you need — we'll deliver it"}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8 bg-secondary/50">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <Separator />

                {/* Scrollable Items */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
                    {items.map((item, index) => (
                        <Card key={index} className="bg-secondary/40 border-border/50">
                            <CardContent className="p-4 space-y-3">
                                {/* Item header */}
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-primary text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center p-0">
                                        {index + 1}
                                    </Badge>
                                    <span className="text-xs font-bold text-muted-foreground">
                                        {isBn ? 'পণ্যের নাম' : 'Product Name'}
                                    </span>
                                    {items.length > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => removeItem(index)} className="ml-auto text-destructive hover:bg-destructive/10 w-7 h-7 rounded-lg">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    )}
                                </div>

                                {/* Product name input */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder={t.typeProductName}
                                        value={item.productNameBn || item.productNameEn}
                                        onChange={e => {
                                            updateItem(index, 'productNameBn', e.target.value);
                                            updateItem(index, 'productNameEn', e.target.value);
                                            handleSearch(e.target.value, index);
                                        }}
                                        className="pl-10 h-12 rounded-xl bg-card/80"
                                    />
                                    {/* Suggestions */}
                                    {activeIndex === index && suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto">
                                            {suggestions.map(s => (
                                                <button key={s._id} onClick={() => selectSuggestion(s, index)}
                                                    className="w-full text-left px-4 py-3 hover:bg-secondary/50 flex justify-between items-center text-sm border-b border-border/50 last:border-0 transition-colors">
                                                    <span className="font-bold">{isBn ? s.nameBn : s.nameEn}</span>
                                                    <span className="text-[11px] text-muted-foreground">{isBn ? (s.unitBn || s.unit) : s.unit}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Quantity & Unit */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] text-muted-foreground font-bold mb-1 block">{t.quantity}</label>
                                        <Input
                                            type="number"
                                            min={0.1} step={0.5}
                                            value={item.quantity}
                                            onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                                            className="h-11 rounded-xl bg-card/80"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-muted-foreground font-bold mb-1 block">{t.unit}</label>
                                        <select
                                            value={item.unit}
                                            onChange={e => {
                                                const unit = UNITS.find(u => u.value === e.target.value);
                                                updateItem(index, 'unit', e.target.value);
                                                updateItem(index, 'unitBn', unit?.label.split(' ')[0] || e.target.value);
                                            }}
                                            className="w-full h-11 rounded-xl bg-card/80 border border-border px-3 text-sm cursor-pointer focus:ring-2 focus:ring-primary outline-none"
                                        >
                                            {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Shop preference */}
                                <Input
                                    placeholder={t.shopPreference}
                                    value={item.shopPreference || ''}
                                    onChange={e => updateItem(index, 'shopPreference', e.target.value)}
                                    className="h-10 rounded-xl bg-card/80 text-xs"
                                />
                            </CardContent>
                        </Card>
                    ))}

                    {/* Add item */}
                    <button
                        onClick={addItem}
                        className="w-full p-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> {t.addItem}
                    </button>
                </div>

                {/* Bottom action - never cut off */}
                <div className="flex-shrink-0 p-5 pt-3 border-t border-border/50 bg-card/50 backdrop-blur-sm">
                    <Button
                        onClick={handleAddAllToCart}
                        className="w-full h-14 bg-primary hover:bg-red-600 text-white font-bold rounded-2xl text-base shadow-lg shadow-primary/25"
                    >
                        {isBn ? 'কার্টে যোগ করুন' : 'Add All to Cart'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
