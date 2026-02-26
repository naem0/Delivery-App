'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

import TopBanner from './TopBanner';
import HeaderNav from './HeaderNav';
import HeroSection from './HeroSection';
import CategorySection from './CategorySection';
import ProductSection from './ProductSection';
import TestimonialSection from './TestimonialSection';
import FooterSection from './FooterSection';

import CustomOrderModal from '@/components/CustomOrderModal';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';

interface HomeClientProps {
    categories: any[];
    products: any[];
}

export default function HomeClient({ categories, products }: HomeClientProps) {
    const { cart } = useApp();
    const [showCustomOrder, setShowCustomOrder] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <TopBanner />

            <HeaderNav
                onCartClick={() => setShowCart(true)}
                onAuthClick={() => setShowAuth(true)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <main className="max-w-7xl mx-auto px-4 py-8 md:px-8 gradient-bg main-content">
                <HeroSection onCustomOrderClick={() => setShowCustomOrder(true)} />
                <CategorySection categories={categories} />
                <ProductSection products={products} />
                <TestimonialSection />
            </main>

            <FooterSection />

            {/* Mobile FAB */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setShowCart(true)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black w-14 h-14 rounded-full shadow-2xl border-4 border-card relative"
                    size="icon"
                >
                    <ShoppingCart className="w-6 h-6" />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {cart.length}
                        </span>
                    )}
                </Button>
            </div>

            {/* Modals */}
            {showCustomOrder && (
                <CustomOrderModal
                    onClose={() => setShowCustomOrder(false)}
                    onLoginRequired={() => { setShowCustomOrder(false); setShowAuth(true); }}
                />
            )}
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
            {showCart && (
                <CartDrawer
                    onClose={() => setShowCart(false)}
                    onLoginRequired={() => { setShowCart(false); setShowAuth(true); }}
                />
            )}
        </div>
    );
}
