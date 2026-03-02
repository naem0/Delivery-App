'use client';
import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import TopBanner from './TopBanner';
import HeaderNav from './HeaderNav';
import HeroSection from './HeroSection';
import CategorySection, { CategoryData } from './CategorySection';
import ProductSection, { ProductData } from './ProductSection';
import TestimonialSection from './TestimonialSection';
import FooterSection from './FooterSection';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import CustomOrderModal from '@/components/CustomOrderModal';
import MyOrdersModal from '@/components/MyOrdersModal';

interface HomeWrapperProps {
    categories: CategoryData[];
    products: ProductData[];
}

export default function HomeWrapper({ categories, products }: HomeWrapperProps) {
    const { cart, language } = useApp();
    const isBn = language === 'bn';

    // Modal states
    const [showCustomOrder, setShowCustomOrder] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showMyOrders, setShowMyOrders] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showAllProducts, setShowAllProducts] = useState(false);

    // Listen for 'open-my-orders' custom event (fired from CartDrawer success screen)
    useEffect(() => {
        const handler = () => setShowMyOrders(true);
        window.addEventListener('open-my-orders', handler);
        return () => window.removeEventListener('open-my-orders', handler);
    }, []);

    // Filter products by category and search
    const filteredProducts = useMemo(() => {
        let filtered = products;
        if (selectedCategory) {
            filtered = filtered.filter(p => {
                const catId = typeof p.categoryId === 'object' ? p.categoryId?._id : p.categoryId;
                return catId === selectedCategory;
            });
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.nameEn.toLowerCase().includes(q) ||
                p.nameBn.includes(q)
            );
        }
        if (!showAllProducts && !selectedCategory && !searchQuery.trim()) {
            return filtered.slice(0, 10);
        }
        return filtered;
    }, [products, selectedCategory, searchQuery, showAllProducts]);

    const selectedCategoryObj = selectedCategory
        ? categories.find(c => c._id === selectedCategory)
        : null;
    const selectedCategoryName = selectedCategoryObj
        ? (isBn ? selectedCategoryObj.nameBn : selectedCategoryObj.nameEn)
        : null;

    const handleCategoryClick = (catId: string) => {
        if (selectedCategory === catId) {
            setSelectedCategory(null);
            setShowAllProducts(false);
        } else {
            setSelectedCategory(catId);
            setShowAllProducts(true);
        }
    };

    const handleViewAll = () => {
        setSelectedCategory(null);
        setShowAllProducts(true);
    };

    const handleClearFilters = () => {
        setSelectedCategory(null);
        setSearchQuery('');
        setShowAllProducts(false);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        if (value) setShowAllProducts(true);
        else setShowAllProducts(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 gradient-bg">
            <TopBanner />
            <HeaderNav
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onCartClick={() => setShowCart(true)}
                onLoginClick={() => setShowAuth(true)}
                onMyOrdersClick={() => setShowMyOrders(true)}
            />

            <main className="container mx-auto px-4 py-8 md:px-8 main-content">
                <HeroSection onCustomOrderClick={() => setShowCustomOrder(true)} />
                <CategorySection
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryClick={handleCategoryClick}
                    onViewAll={handleViewAll}
                />
                <ProductSection
                    products={filteredProducts}
                    selectedCategoryName={selectedCategoryName}
                    hasFilters={!!selectedCategory || !!searchQuery.trim()}
                    showAllProducts={showAllProducts}
                    onClearFilters={handleClearFilters}
                    onViewAll={handleViewAll}
                />
                <TestimonialSection />
            </main>

            <FooterSection />

            {/* Mobile FAB */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <Button onClick={() => setShowCart(true)} className="bg-yellow-400 hover:bg-yellow-500 text-black w-14 h-14 rounded-full shadow-2xl border-4 border-card relative" size="icon">
                    <ShoppingCart className="w-6 h-6" />
                    {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cart.length}</span>}
                </Button>
            </div>

            {/* Modals */}
            {showCustomOrder && <CustomOrderModal onClose={() => setShowCustomOrder(false)} onLoginRequired={() => { setShowCustomOrder(false); setShowAuth(true); }} />}
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
            {showCart && <CartDrawer onClose={() => setShowCart(false)} onLoginRequired={() => { setShowCart(false); setShowAuth(true); }} />}
            {showMyOrders && <MyOrdersModal onClose={() => setShowMyOrders(false)} onLoginRequired={() => { setShowMyOrders(false); setShowAuth(true); }} />}
        </div>
    );
}
