'use client';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
    _id: string;
    nameEn: string;
    nameBn: string;
    icon: string;
    color?: string;
}

interface CategorySectionProps {
    categories: Category[];
}

const FALLBACK_CATEGORIES: Category[] = [
    { _id: '1', nameEn: 'Street Foods', nameBn: 'রাস্তার খাবার', icon: 'fastfood', color: 'text-orange-500' },
    { _id: '2', nameEn: 'Pharmacy', nameBn: 'ফার্মেসি', icon: 'local_pharmacy', color: 'text-blue-500' },
    { _id: '3', nameEn: 'Groceries', nameBn: 'মুদি দোকান', icon: 'shopping_basket', color: 'text-emerald-500' },
    { _id: '4', nameEn: 'Electronics', nameBn: 'ইলেকট্রনিক্স', icon: 'devices', color: 'text-purple-500' },
    { _id: '5', nameEn: 'Wellness', nameBn: 'স্বাস্থ্য', icon: 'favorite', color: 'text-pink-500' },
    { _id: '6', nameEn: 'Meat & Fish', nameBn: 'মাছ ও মাংস', icon: 'set_meal', color: 'text-yellow-500' },
];

export default function CategorySection({ categories }: CategorySectionProps) {
    const { t, language } = useApp();
    const isBn = language === 'bn';
    const displayCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

    return (
        <section className="mb-16 animate-slide-up">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black flex items-center gap-2">
                    {t.categories}
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </h2>
                <a className="text-primary font-bold text-sm hover:underline cursor-pointer">{t.viewAll}</a>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {displayCategories.map(cat => (
                    <Card key={cat._id} className="group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:border-primary/50 border">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className={`material-icons text-3xl ${cat.color || 'text-primary'}`}>{cat.icon}</span>
                            </div>
                            <span className="text-xs font-bold">{isBn ? cat.nameBn : cat.nameEn}</span>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
