'use client';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ChevronDown, Shuffle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
    _id: string;
    nameEn: string;
    nameBn: string;
    unit: string;
    unitBn?: string;
    priceGuide?: { min: number; max: number };
    isPopular?: boolean;
    image?: string;
}

interface ProductSectionProps {
    products: Product[];
}

const FALLBACK_IMAGES = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBg0_3u14eIfJPtCYmo4FpRUHD4Weeufa7RgasH7apFmO8jtkdY0kr21A0ik_PTqWVkQiV2XnaXsKA__An4FM9sphi30pKqS3ErlAHvHgbZ_RkJtPCRGFFpZkNjo8H9mVBQ82J6e-xPsRey5Ej2K6H3UvCcc-1tzZdfkzpfRdHJMc2tpCJI4Ie2PJhHSbjReRGFLmqauFX8ZTxtHrf-96l1pelVavCBQZ5miyk8GkoI06DjP9p3PlhKUm54euBT0t7MiNqI0jm5NGvr',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBF4UDMSQfQaNr9klXVEJZZOH4FHbsYobzhj5Ys8g5tBzpTg1W7VhAZBmFGh_IOVlJGJi3XOj3e4Wb0-CgRtYhuwZ8AUVl8pzFrEhH14ScUMgH2_c8bxpjuXYvu5OlOUvY1rofBDaizPQawhduDtQZJO_zPam1kfiRsKYIYCbP_ZkieMgu4picP10KaZoSZDrFSODEdYYrIpejf8W7umsLh5vk1GtvRtJldePoRAJkCkSkN8I5Mr6YgWwS6mmJBRKR84IGQvv1rB7d6',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCiXBDAPlObqHePmyiNdP4HXj7JhwPOdoFRA8YvQHnbhRlFOoM7btS3kTJWQfwYbsj4ixXiui53xMb9mBR88bvV6utujbpcmETztp_76kJHglltqfIMRFbbldIWJVetcMsI3yJlXHGx_CIC5GVZf7Rw5-NEXHljQvJjqDQ-RNR3OaOr1ICg1_UX-fnKpp_RQDfnRWXEAxWY4DeCYfYbtzdJbeXph5Wj4Cm_ButjhUrApwv9uuDybPwwpVP1dNmPotqze21NBwK8wQCZ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCp_tpyDgjYaD1JDeMaB-lOiiNz2hQHaR8nRIjZNaXpbMmbOA7jrZJrIaelfjZRr_95gQ1lb6f4Z_0RJ3Nk9Z7nkhr-8fXOt_q5D8Rf8QmEp2vrzM6Tkb0zp7dObUAZkVWE0Hdi6fXYW2djgpZSNqMxNJeDUKSCuxmh1SgXHyfYflUuW_2l3aFk61yL1m0yKW4PAs-CBvpxpGDjALZvM_usfwqbxCwsYJ9zEO-eUwEYu757J2YNNsoZPNI0SgL5tzVEsac-o5XfNP4c',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBjh4dW3ISgy1xjEf-YPUTfWqA9kU1LZOk4sG8mrXOrGecByvjLWKa1pSPgWrNUKR4BYPgbpqyrjHb3t5PLg3C-T30E8zny0Gym9WpPy2SC2__O5X_J82eR5AR8P_wiP1itnPIpQBaiplaIaUK3V2YkJn-guqF_YbqBenRDEJf9TZOpp63CJuPKmdzO6SegEzGE9MrGXJtXG1AhYWBVgooAsY3Y4YX4uUTpBmpracKsnOQEMGRCCvBZOdh8_VfBjKSIzPnHxv51xO1x',
];

export default function ProductSection({ products }: ProductSectionProps) {
    const { t, language, addToCart } = useApp();
    const isBn = language === 'bn';

    const handleAddToCart = (product: Product, idx: number) => {
        addToCart({
            productId: product._id,
            productNameEn: product.nameEn,
            productNameBn: product.nameBn,
            quantity: 1,
            unit: product.unit,
            unitBn: product.unitBn || product.unit,
            priceEstimate: product.priceGuide?.min || 0,
            image: product.image || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
        });
        toast.success(isBn ? `${product.nameBn} কার্টে যোগ হয়েছে` : `${product.nameEn} added to cart`);
    };

    return (
        <section className="mb-16 bg-secondary/50 p-6 md:p-10 rounded-[40px] border animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h2 className="text-3xl font-black mb-2">{t.ourRecommendations}</h2>
                    <p className="text-sm text-muted-foreground italic">{t.recommendationSubtext}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold">
                        <Eye className="w-3 h-3 text-primary" /> 5364 {t.viewingNow}
                    </Badge>
                    <Button size="sm" className="bg-primary hover:bg-red-600 text-white font-bold rounded-full shadow-lg">
                        <Shuffle className="w-4 h-4 mr-1" /> {t.shuffle}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.map((product, idx) => (
                    <Card key={product._id} className="group hover:shadow-2xl transition-all bg-card">
                        <CardContent className="p-4">
                            <div className="aspect-square bg-secondary rounded-2xl mb-4 overflow-hidden relative">
                                <img
                                    alt={isBn ? product.nameBn : product.nameEn}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    src={product.image || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                                />
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
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="rounded-xl hover:bg-primary hover:text-white transition-colors"
                                    onClick={() => handleAddToCart(product, idx)}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-12 flex justify-center">
                <Button variant="outline" className="bg-card/50 hover:bg-card px-8 py-3 rounded-2xl font-bold text-sm">
                    {t.showMoreSurprises}
                    <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </section>
    );
}
