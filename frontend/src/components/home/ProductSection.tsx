'use client';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ChevronDown, Shuffle, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

export interface ProductData {
    _id: string;
    nameEn: string;
    nameBn: string;
    unit: string;
    unitBn?: string;
    priceGuide?: { min: number; max: number };
    isPopular?: boolean;
    image?: string;
    categoryId?: string | { _id: string; nameEn: string; nameBn: string };
}

interface ProductSectionProps {
    products: ProductData[];
    selectedCategoryName?: string | null;
    hasFilters: boolean;
    showAllProducts: boolean;
    onClearFilters: () => void;
    onViewAll: () => void;
}

export default function ProductSection({ products, selectedCategoryName, hasFilters, showAllProducts, onClearFilters, onViewAll }: ProductSectionProps) {
    const { t, language, addToCart } = useApp();
    const isBn = language === 'bn';

    const handleAddToCart = (product: ProductData) => {
        addToCart({
            productId: product._id,
            productNameEn: product.nameEn,
            productNameBn: product.nameBn,
            quantity: 1,
            unit: product.unit,
            unitBn: product.unitBn || product.unit,
            priceEstimate: product.priceGuide?.min || 0,
            image: product.image,
        });
        toast.success(isBn ? `${product.nameBn} কার্টে যোগ হয়েছে` : `${product.nameEn} added to cart`);
    };

    return (
        <section className="mb-16 bg-secondary/50 p-6 md:p-10 rounded-[40px] border animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h2 className="text-3xl font-black mb-2">
                        {selectedCategoryName || t.ourRecommendations}
                    </h2>
                    <p className="text-sm text-muted-foreground italic">
                        {hasFilters
                            ? (isBn ? `${products.length}টি পণ্য পাওয়া গেছে` : `${products.length} products found`)
                            : t.recommendationSubtext
                        }
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {hasFilters && (
                        <Button variant="outline" size="sm" onClick={onClearFilters} className="rounded-full text-xs gap-1">
                            <X className="w-3 h-3" /> {isBn ? 'ফিল্টার সরান' : 'Clear Filters'}
                        </Button>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold">
                        <Eye className="w-3 h-3 text-primary" /> 5364 {t.viewingNow}
                    </Badge>
                    <Button size="sm" className="bg-primary hover:bg-red-600 text-white font-bold rounded-full shadow-lg">
                        <Shuffle className="w-4 h-4 mr-1" /> {t.shuffle}
                    </Button>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-16">
                    <span className="material-icons text-6xl text-muted-foreground/30 mb-4 block">search_off</span>
                    <p className="font-bold text-muted-foreground">{isBn ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{isBn ? 'অন্য ক্যাটেগরি বা সার্চ ব্যবহার করুন' : 'Try another category or search term'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {products.map(product => (
                        <Card key={product._id} className="group hover:shadow-2xl transition-all bg-card">
                            <CardContent className="p-4">
                                <div className="aspect-square bg-secondary rounded-2xl mb-4 overflow-hidden relative">
                                    {product.image ? (
                                        <img alt={isBn ? product.nameBn : product.nameEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={product.image} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-icons text-5xl text-muted-foreground/20">inventory_2</span>
                                        </div>
                                    )}
                                    {product.isPopular && (
                                        <Badge className="absolute top-2 left-2 bg-red-500 text-[8px] font-black text-white uppercase">
                                            {isBn ? 'জনপ্রিয়' : 'Popular'}
                                        </Badge>
                                    )}
                                </div>
                                <h4 className="text-xs font-bold mb-1 truncate">{isBn ? product.nameBn : product.nameEn}</h4>
                                <p className="text-[10px] text-muted-foreground mb-3">{isBn ? (product.unitBn || product.unit) : product.unit}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-black">
                                        {product.priceGuide && product.priceGuide.min > 0 ? `৳${product.priceGuide.min}` : ''}
                                    </span>
                                    <Button size="icon" variant="secondary" className="rounded-xl hover:bg-primary hover:text-white transition-colors" onClick={() => handleAddToCart(product)}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!showAllProducts && !hasFilters && (
                <div className="mt-12 flex justify-center">
                    <Button variant="outline" onClick={onViewAll} className="bg-card/50 hover:bg-card px-8 py-3 rounded-2xl font-bold text-sm">
                        {t.showMoreSurprises} <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            )}
        </section>
    );
}
