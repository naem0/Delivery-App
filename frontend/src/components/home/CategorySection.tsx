'use client';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface CategoryData {
    _id: string;
    nameEn: string;
    nameBn: string;
    icon: string;
    color?: string;
}

interface CategorySectionProps {
    categories: CategoryData[];
    selectedCategory: string | null;
    onCategoryClick: (id: string) => void;
    onViewAll: () => void;
}

export default function CategorySection({ categories, selectedCategory, onCategoryClick, onViewAll }: CategorySectionProps) {
    const { t, language } = useApp();
    const isBn = language === 'bn';

    // Material icon color map for API categories
    const iconColorMap: Record<string, string> = {
        fastfood: 'text-orange-500', local_pharmacy: 'text-blue-500',
        shopping_basket: 'text-emerald-500', devices: 'text-purple-500',
        favorite: 'text-pink-500', set_meal: 'text-yellow-500',
        local_grocery_store: 'text-emerald-500', bakery_dining: 'text-amber-500',
    };

    return (
        <section className="mb-16 animate-slide-up">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black flex items-center gap-2">
                    {t.categories}
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </h2>
                <Button variant="ghost" size="sm" onClick={onViewAll} className="text-primary font-bold text-sm hover:underline">
                    {t.viewAll}
                </Button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map(cat => (
                    <Card
                        key={cat._id}
                        onClick={() => onCategoryClick(cat._id)}
                        className={`group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl border ${selectedCategory === cat._id ? 'border-primary ring-2 ring-primary/20 shadow-lg' : 'hover:border-primary/50'}`}
                    >
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${selectedCategory === cat._id ? 'bg-primary/10' : 'bg-secondary'}`}>
                                <span className="text-3xl">{cat.icon || '🛒'}</span>
                            </div>
                            <span className={`text-xs font-bold ${selectedCategory === cat._id ? 'text-primary' : ''}`}>
                                {isBn ? cat.nameBn : cat.nameEn}
                            </span>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
