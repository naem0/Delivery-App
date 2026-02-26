'use client';
import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    Search, MapPin, ShoppingCart, ArrowRight, Star, Plus,
    ChevronDown, Shuffle, Eye, Smartphone, Moon, Sun, Globe, User, LogOut, X
} from 'lucide-react';
import CustomOrderModal from '@/components/CustomOrderModal';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import toast from 'react-hot-toast';

const CATEGORIES = [
    { id: '1', nameEn: 'Street Foods', nameBn: 'রাস্তার খাবার', icon: 'fastfood', color: 'text-orange-500' },
    { id: '2', nameEn: 'Pharmacy', nameBn: 'ফার্মেসি', icon: 'local_pharmacy', color: 'text-blue-500' },
    { id: '3', nameEn: 'Groceries', nameBn: 'মুদি দোকান', icon: 'shopping_basket', color: 'text-emerald-500' },
    { id: '4', nameEn: 'Electronics', nameBn: 'ইলেকট্রনিক্স', icon: 'devices', color: 'text-purple-500' },
    { id: '5', nameEn: 'Wellness', nameBn: 'স্বাস্থ্য', icon: 'favorite', color: 'text-pink-500' },
    { id: '6', nameEn: 'Meat & Fish', nameBn: 'মাছ ও মাংস', icon: 'set_meal', color: 'text-yellow-500' },
];

const ALL_PRODUCTS = [
    { id: 'p1', nameEn: 'Radhuni Chilli Powder', nameBn: 'রাঁধুনি মরিচ গুঁড়া', unit: '100gm Pack', unitBn: '১০০ গ্রাম প্যাক', price: 45, badge: 'Top Choice', badgeBn: 'সেরা পছন্দ', badgeColor: 'bg-red-500', categoryId: '3', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg0_3u14eIfJPtCYmo4FpRUHD4Weeufa7RgasH7apFmO8jtkdY0kr21A0ik_PTqWVkQiV2XnaXsKA__An4FM9sphi30pKqS3ErlAHvHgbZ_RkJtPCRGFFpZkNjo8H9mVBQ82J6e-xPsRey5Ej2K6H3UvCcc-1tzZdfkzpfRdHJMc2tpCJI4Ie2PJhHSbjReRGFLmqauFX8ZTxtHrf-96l1pelVavCBQZ5miyk8GkoI06DjP9p3PlhKUm54euBT0t7MiNqI0jm5NGvr' },
    { id: 'p2', nameEn: 'Maggi Masala Noodles', nameBn: 'ম্যাগি মশলা নুডলস', unit: '4pcs Pack', unitBn: '৪ পিস প্যাক', price: 100, categoryId: '1', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF4UDMSQfQaNr9klXVEJZZOH4FHbsYobzhj5Ys8g5tBzpTg1W7VhAZBmFGh_IOVlJGJi3XOj3e4Wb0-CgRtYhuwZ8AUVl8pzFrEhH14ScUMgH2_c8bxpjuXYvu5OlOUvY1rofBDaizPQawhduDtQZJO_zPam1kfiRsKYIYCbP_ZkieMgu4picP10KaZoSZDrFSODEdYYrIpejf8W7umsLh5vk1GtvRtJldePoRAJkCkSkN8I5Mr6YgWwS6mmJBRKR84IGQvv1rB7d6' },
    { id: 'p3', nameEn: 'Rupchanda (Pomfret)', nameBn: 'রূপচান্দা (পমফ্রেট)', unit: '500gm Approx', unitBn: '৫০০ গ্রাম আনুমানিক', price: 1390, badge: 'Fresh Catch', badgeBn: 'তাজা মাছ', badgeColor: 'bg-emerald-500', categoryId: '6', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiXBDAPlObqHePmyiNdP4HXj7JhwPOdoFRA8YvQHnbhRlFOoM7btS3kTJWQfwYbsj4ixXiui53xMb9mBR88bvV6utujbpcmETztp_76kJHglltqfIMRFbbldIWJVetcMsI3yJlXHGx_CIC5GVZf7Rw5-NEXHljQvJjqDQ-RNR3OaOr1ICg1_UX-fnKpp_RQDfnRWXEAxWY4DeCYfYbtzdJbeXph5Wj4Cm_ButjhUrApwv9uuDybPwwpVP1dNmPotqze21NBwK8wQCZ' },
    { id: 'p4', nameEn: 'Special Bhapa Pitha', nameBn: 'স্পেশাল ভাপা পিঠা', unit: '1 pcs Large', unitBn: '১ পিস বড়', price: 25, categoryId: '1', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp_tpyDgjYaD1JDeMaB-lOiiNz2hQHaR8nRIjZNaXpbMmbOA7jrZJrIaelfjZRr_95gQ1lb6f4Z_0RJ3Nk9Z7nkhr-8fXOt_q5D8Rf8QmEp2vrzM6Tkb0zp7dObUAZkVWE0Hdi6fXYW2djgpZSNqMxNJeDUKSCuxmh1SgXHyfYflUuW_2l3aFk61yL1m0yKW4PAs-CBvpxpGDjALZvM_usfwqbxCwsYJ9zEO-eUwEYu757J2YNNsoZPNI0SgL5tzVEsac-o5XfNP4c' },
    { id: 'p5', nameEn: 'Radhuni Mustard Oil', nameBn: 'রাঁধুনি সরিষার তেল', unit: '80ml Bottle', unitBn: '৮০ মিলি বোতল', price: 40, categoryId: '3', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjh4dW3ISgy1xjEf-YPUTfWqA9kU1LZOk4sG8mrXOrGecByvjLWKa1pSPgWrNUKR4BYPgbpqyrjHb3t5PLg3C-T30E8zny0Gym9WpPy2SC2__O5X_J82eR5AR8P_wiP1itnPIpQBaiplaIaUK3V2YkJn-guqF_YbqBenRDEJf9TZOpp63CJuPKmdzO6SegEzGE9MrGXJtXG1AhYWBVgooAsY3Y4YX4uUTpBmpracKsnOQEMGRCCvBZOdh8_VfBjKSIzPnHxv51xO1x' },
    { id: 'p6', nameEn: 'Paracetamol 500mg', nameBn: 'প্যারাসিটামল ৫০০মিগ্রা', unit: '10 Tablets', unitBn: '১০ ট্যাবলেট', price: 12, categoryId: '2', badge: 'Essential', badgeBn: 'জরুরি', badgeColor: 'bg-blue-500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg0_3u14eIfJPtCYmo4FpRUHD4Weeufa7RgasH7apFmO8jtkdY0kr21A0ik_PTqWVkQiV2XnaXsKA__An4FM9sphi30pKqS3ErlAHvHgbZ_RkJtPCRGFFpZkNjo8H9mVBQ82J6e-xPsRey5Ej2K6H3UvCcc-1tzZdfkzpfRdHJMc2tpCJI4Ie2PJhHSbjReRGFLmqauFX8ZTxtHrf-96l1pelVavCBQZ5miyk8GkoI06DjP9p3PlhKUm54euBT0t7MiNqI0jm5NGvr' },
    { id: 'p7', nameEn: 'USB-C Cable', nameBn: 'ইউএসবি-সি ক্যাবল', unit: '1 Meter', unitBn: '১ মিটার', price: 150, categoryId: '4', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF4UDMSQfQaNr9klXVEJZZOH4FHbsYobzhj5Ys8g5tBzpTg1W7VhAZBmFGh_IOVlJGJi3XOj3e4Wb0-CgRtYhuwZ8AUVl8pzFrEhH14ScUMgH2_c8bxpjuXYvu5OlOUvY1rofBDaizPQawhduDtQZJO_zPam1kfiRsKYIYCbP_ZkieMgu4picP10KaZoSZDrFSODEdYYrIpejf8W7umsLh5vk1GtvRtJldePoRAJkCkSkN8I5Mr6YgWwS6mmJBRKR84IGQvv1rB7d6' },
    { id: 'p8', nameEn: 'Vitamin C 1000mg', nameBn: 'ভিটামিন সি ১০০০মিগ্রা', unit: '30 Tablets', unitBn: '৩০ ট্যাবলেট', price: 250, categoryId: '5', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiXBDAPlObqHePmyiNdP4HXj7JhwPOdoFRA8YvQHnbhRlFOoM7btS3kTJWQfwYbsj4ixXiui53xMb9mBR88bvV6utujbpcmETztp_76kJHglltqfIMRFbbldIWJVetcMsI3yJlXHGx_CIC5GVZf7Rw5-NEXHljQvJjqDQ-RNR3OaOr1ICg1_UX-fnKpp_RQDfnRWXEAxWY4DeCYfYbtzdJbeXph5Wj4Cm_ButjhUrApwv9uuDybPwwpVP1dNmPotqze21NBwK8wQCZ' },
    { id: 'p9', nameEn: 'Ilish (Hilsa Fish)', nameBn: 'ইলিশ মাছ', unit: '1pc ~800gm', unitBn: '১ পিস ~৮০০ গ্রাম', price: 950, badge: 'Seasonal', badgeBn: 'মৌসুমি', badgeColor: 'bg-yellow-500', categoryId: '6', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp_tpyDgjYaD1JDeMaB-lOiiNz2hQHaR8nRIjZNaXpbMmbOA7jrZJrIaelfjZRr_95gQ1lb6f4Z_0RJ3Nk9Z7nkhr-8fXOt_q5D8Rf8QmEp2vrzM6Tkb0zp7dObUAZkVWE0Hdi6fXYW2djgpZSNqMxNJeDUKSCuxmh1SgXHyfYflUuW_2l3aFk61yL1m0yKW4PAs-CBvpxpGDjALZvM_usfwqbxCwsYJ9zEO-eUwEYu757J2YNNsoZPNI0SgL5tzVEsac-o5XfNP4c' },
    { id: 'p10', nameEn: 'Miniket Rice', nameBn: 'মিনিকেট চাল', unit: '5kg Bag', unitBn: '৫ কেজি ব্যাগ', price: 420, categoryId: '3', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjh4dW3ISgy1xjEf-YPUTfWqA9kU1LZOk4sG8mrXOrGecByvjLWKa1pSPgWrNUKR4BYPgbpqyrjHb3t5PLg3C-T30E8zny0Gym9WpPy2SC2__O5X_J82eR5AR8P_wiP1itnPIpQBaiplaIaUK3V2YkJn-guqF_YbqBenRDEJf9TZOpp63CJuPKmdzO6SegEzGE9MrGXJtXG1AhYWBVgooAsY3Y4YX4uUTpBmpracKsnOQEMGRCCvBZOdh8_VfBjKSIzPnHxv51xO1x' },
];

const REVIEWS = [
    { name: 'Sohan E.', nameBn: 'সোহান ই.', textEn: '"Blackout in the area, still got candles and batteries delivered. DeliveryHobe works when others don\'t!"', textBn: '"এলাকায় ব্ল্যাকআউট, তবুও মোমবাতি আর ব্যাটারি পেয়ে গেলাম। ডেলিভারিহবে কাজ করে যখন অন্যরা পারে না!"', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_23lnojx6BO012f5AgJIZ2vPdmsYHsX-NH6_xwfU8PIwPCJTU6uIARa3TfkR34EzpztzuOIhiHdC2Ucq-QXrLAcVH9yJPaK1sV2VpFDcuNDYcLRxNdKMibYd9aO3ZeB7mLOEV_7-yAKvIrlKkgL3bL-_djQCD63w31J_CN1jHWfP6qne_Shc0EIM2a07TuqGFGkmEvlICCDxhFFGCgLc5E0eG3SD7SB_ACUzNIKyDfoLKMLYVPaDQ3NviQi6H2kqRE_spVKzPXRzK' },
    { name: 'Ehsanur R.', nameBn: 'এহসানুর আর.', textEn: '"Emergency meds delivered in 20 mins during hartal. This app is a blessing for emergencies!"', textBn: '"হরতালের সময় ২০ মিনিটে জরুরি ওষুধ পেয়ে গেলাম। জরুরি সময়ে এই অ্যাপ আশীর্বাদ!"', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkL6JSZtB__F71E_CdYM1uftClwg35z3ree7_N-9BUkwOxaHhMQCIVXRvohD1hYE8xRxW_819xiD5ZYmBAO1M7vJkpCw4g3l_ublXKwdpWVq_DNcieiHmgBR1tZi4EEPsheRTA96J1i6Wv_TpejNvnkQKXzbM6TSlMIzfI-NbwlGfxNZwsGTQ7SDpYMbwLpVjG3oaUGsiU-GI9En4j_2vQAl20tQGjv445Kp-Xdfbax-PZULclImCgG0U3meHA39si1ndMroPisp0t' },
    { name: 'Saroar S.', nameBn: 'সারোয়ার এস.', textEn: '"Can\'t believe I got fresh bhelpuri at 2 AM! DeliveryHobe saved my late-night cravings. Super fast!"', textBn: '"রাত ২টায় ভেলপুরি পেয়ে গেলাম! ডেলিভারিহবে আমার রাতের ক্ষুধা মিটিয়ে দিল। দারুণ দ্রুত!"', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWUMRDI90vxlHZe61JwMCvzZ5xAQ6Ks0PvMYVhAfO9nEPqhyLO917XmpFXStXxeJKFkpgJC679s1BPo1UmFPJR-NBYPMIy36Hq75dwH_PQYLtRSU2YXwuNkHUiA5mo7bDSS4ji2BiQFzLZVfU-V5d4gdW9hMadskE-XjE16TrFekaTQGvqw6yW2cn61Q7GgA2PzgSevTq5D_HEHzPQ2HeALj4g4okSXg6lvQ-tlsXNtIHsQu8m7QjHxVV-7wOkMGKtN-_BicuApB7l' },
];

export default function HomeClient() {
    const { t, cart, addToCart, language, setLanguage, theme, toggleTheme } = useApp();
    const { data: session } = useSession();
    const [showCustomOrder, setShowCustomOrder] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showAllProducts, setShowAllProducts] = useState(false);

    const isBn = language === 'bn';
    const cartTotal = cart.reduce((sum, item) => sum + (item.priceEstimate || 0) * item.quantity, 0);

    // Filter products by category and search
    const filteredProducts = useMemo(() => {
        let products = ALL_PRODUCTS;
        if (selectedCategory) {
            products = products.filter(p => p.categoryId === selectedCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            products = products.filter(p =>
                p.nameEn.toLowerCase().includes(q) ||
                p.nameBn.includes(q) ||
                p.unitBn.includes(q) ||
                p.unit.toLowerCase().includes(q)
            );
        }
        if (!showAllProducts && !selectedCategory && !searchQuery.trim()) {
            return products.slice(0, 5);
        }
        return products;
    }, [selectedCategory, searchQuery, showAllProducts]);

    const selectedCategoryName = selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory) : null;

    const handleAddToCart = (product: typeof ALL_PRODUCTS[0]) => {
        addToCart({
            productId: product.id,
            productNameEn: product.nameEn,
            productNameBn: product.nameBn,
            quantity: 1,
            unit: product.unit,
            unitBn: product.unitBn,
            priceEstimate: product.price,
            image: product.img,
        });
        toast.success(isBn ? `${product.nameBn} কার্টে যোগ হয়েছে` : `${product.nameEn} added to cart`);
    };

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

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* ===== TOP BANNER ===== */}
            <div className="bg-emerald-600 text-white text-[10px] md:text-xs font-bold py-1.5 text-center uppercase tracking-widest">
                {t.wereOpen}
            </div>

            {/* ===== HEADER / NAVBAR ===== */}
            <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b px-4 py-3 md:px-8">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-primary font-extrabold text-2xl tracking-tighter">{t.appName}</span>
                        <span className="hidden md:block text-[10px] text-muted-foreground font-medium leading-none whitespace-pre-line">
                            {isBn ? '২৪/৭ জরুরি\nডেলিভারি' : '24/7 EMERGENCY\nDELIVERIES'}
                        </span>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl hidden md:flex items-center bg-secondary rounded-full px-4 py-2 border border-transparent focus-within:border-primary transition-all">
                        <Search className="text-muted-foreground w-4 h-4 mr-2 flex-shrink-0" />
                        <Input
                            type="text"
                            className="bg-transparent border-none shadow-none focus-visible:ring-0 text-sm h-auto p-0 placeholder:text-muted-foreground"
                            placeholder={t.searchPlaceholder}
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); if (e.target.value) setShowAllProducts(true); }}
                        />
                        {searchQuery && (
                            <button onClick={() => { setSearchQuery(''); setShowAllProducts(false); }} className="text-muted-foreground hover:text-foreground">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="hidden lg:flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full border">
                            <MapPin className="text-primary w-4 h-4" />
                            <div className="text-[10px]">
                                <p className="text-muted-foreground leading-none">{t.deliveringTo}</p>
                                <p className="font-bold truncate max-w-[120px]">Dhaka, Dhanmondi R/A</p>
                            </div>
                        </div>

                        <Button variant="outline" size="sm" onClick={() => setLanguage(isBn ? 'en' : 'bn')} className="rounded-full text-xs font-bold px-3 gap-1">
                            <Globe className="w-3.5 h-3.5" /> {isBn ? 'EN' : 'বাং'}
                        </Button>

                        <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full w-8 h-8">
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>

                        {/* User/Login — NextAuth session */}
                        {session?.user ? (
                            <Button variant="ghost" size="sm" onClick={() => signOut()} className="rounded-full text-xs gap-1 hidden md:flex">
                                <LogOut className="w-3.5 h-3.5" /> {session.user.name || t.logout}
                            </Button>
                        ) : (
                            <Button variant="ghost" size="sm" onClick={() => setShowAuth(true)} className="rounded-full text-xs gap-1 hidden md:flex">
                                <User className="w-3.5 h-3.5" /> {t.login}
                            </Button>
                        )}

                        <Button onClick={() => setShowCart(true)} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-3 md:px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="text-sm ml-1 hidden sm:inline">৳ {cartTotal.toLocaleString()}</span>
                            <Badge variant="secondary" className="ml-1 bg-black/10 text-[10px] hidden sm:inline-flex">{cart.length} {t.items}</Badge>
                        </Button>
                    </div>
                </div>
            </header>

            {/* ===== MAIN CONTENT ===== */}
            <main className="max-w-7xl mx-auto px-4 py-8 md:px-8 gradient-bg main-content">

                {/* ===== HERO SECTION ===== */}
                <section className="grid lg:grid-cols-12 gap-8 mb-16 animate-fade-in">
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                            {t.heroTitle1} <br /><span className="text-primary">{t.heroTitle2}</span>
                        </h1>
                        <p className="text-muted-foreground mb-8 max-w-lg" dangerouslySetInnerHTML={{
                            __html: isBn
                                ? `আপনার নিকটস্থ দোকান থেকে যেকোনো পণ্য পৌঁছে যাবে মাত্র <span class="text-primary font-bold underline">${t.deliveryTime}</span> নাস্তা থেকে শুরু করে জরুরি ওষুধ — সব পাবেন এখানে।`
                                : `Get anything delivered from your local dokans in as fast as <span class="text-primary font-bold underline">${t.deliveryTime}</span> From snacks to emergency meds, we have you covered.`
                        }} />

                        <Card className="shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span className="material-icons text-primary">edit_note</span>
                                    {t.orderAnythingCustom}
                                </h3>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <Textarea className="flex-1 bg-secondary/50 rounded-2xl p-4 text-sm min-h-[100px] resize-none border-border focus-visible:ring-primary cursor-pointer" placeholder={t.customOrderPlaceholder} onClick={() => setShowCustomOrder(true)} readOnly />
                                    <Button onClick={() => setShowCustomOrder(true)} className="bg-primary hover:bg-red-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg text-base" size="lg">
                                        {t.requestBtn} <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
                                    <span className="material-icons text-[12px]">info</span>
                                    {t.riderCallNote}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-5 relative group hidden lg:block">
                        <div className="aspect-[4/3] bg-primary rounded-3xl overflow-hidden shadow-2xl relative">
                            <img alt="Delivery Guy" className="w-full h-full object-cover opacity-80 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFgm4ohatiXZVJlKoWJHSzTHnyeRvGCUd_aTTqi9Ypxl78Th-K6BGaI9YjiyfD9LJWY4ra2CwLE8K3vcDNw_EbRMcvuM0ukEbBsshH2MOaLqvUBDXcef5JCF3vtfJKTbQ2CgkpSbzxnUX5VnNN2LFoAoCC-Q9oRDvacByhAP2VqXazShjVZa8JsETcNyCAwzWapghOg0KgV_4JYqjF2HO2DMJb11jtozTsR1_69VKNsS7uwDKsS9q6bC6D1si1d5RnD9fw10lxh3-O" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                                <Badge className="bg-yellow-400 text-black text-[10px] font-black w-fit mb-2 uppercase tracking-tighter hover:bg-yellow-500">{isBn ? 'সীমিত অফার' : 'Limited Offer'}</Badge>
                                <h2 className="text-3xl font-black text-white mb-2 italic">DELIVERY HOBE!</h2>
                                <p className="text-white/80 font-bold text-xl">01623-088935 💬</p>
                            </div>
                        </div>
                        <div className="flex justify-center gap-1.5 mt-4">
                            <div className="w-2 h-2 rounded-full bg-primary" /><div className="w-2 h-2 rounded-full bg-muted-foreground/30" /><div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                        </div>
                    </div>
                </section>

                {/* ===== QUICK CATEGORIES ===== */}
                <section className="mb-16 animate-slide-up">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black flex items-center gap-2">
                            {t.categories}
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        </h2>
                        <Button variant="ghost" size="sm" onClick={handleViewAll} className="text-primary font-bold text-sm hover:underline">
                            {t.viewAll}
                        </Button>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {CATEGORIES.map(cat => (
                            <Card
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl border ${selectedCategory === cat.id ? 'border-primary ring-2 ring-primary/20 shadow-lg' : 'hover:border-primary/50'}`}
                            >
                                <CardContent className="p-4 flex flex-col items-center text-center">
                                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${selectedCategory === cat.id ? 'bg-primary/10' : 'bg-secondary'}`}>
                                        <span className={`material-icons text-3xl ${selectedCategory === cat.id ? 'text-primary' : cat.color}`}>{cat.icon}</span>
                                    </div>
                                    <span className={`text-xs font-bold ${selectedCategory === cat.id ? 'text-primary' : ''}`}>{isBn ? cat.nameBn : cat.nameEn}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* ===== PRODUCTS (FILTERED) ===== */}
                <section className="mb-16 bg-secondary/50 p-6 md:p-10 rounded-[40px] border animate-slide-up">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                        <div>
                            <h2 className="text-3xl font-black mb-2">
                                {selectedCategoryName
                                    ? (isBn ? selectedCategoryName.nameBn : selectedCategoryName.nameEn)
                                    : t.ourRecommendations
                                }
                            </h2>
                            <p className="text-sm text-muted-foreground italic">
                                {selectedCategory || searchQuery
                                    ? (isBn ? `${filteredProducts.length}টি পণ্য পাওয়া গেছে` : `${filteredProducts.length} products found`)
                                    : t.recommendationSubtext
                                }
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {(selectedCategory || searchQuery) && (
                                <Button variant="outline" size="sm" onClick={handleClearFilters} className="rounded-full text-xs gap-1">
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

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <span className="material-icons text-6xl text-muted-foreground/30 mb-4 block">search_off</span>
                            <p className="font-bold text-muted-foreground">{isBn ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">{isBn ? 'অন্য ক্যাটেগরি বা সার্চ ব্যবহার করুন' : 'Try another category or search term'}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {filteredProducts.map(product => (
                                <Card key={product.id} className="group hover:shadow-2xl transition-all bg-card">
                                    <CardContent className="p-4">
                                        <div className="aspect-square bg-secondary rounded-2xl mb-4 overflow-hidden relative">
                                            <img alt={isBn ? product.nameBn : product.nameEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={product.img} />
                                            {product.badge && (
                                                <Badge className={`absolute top-2 left-2 ${product.badgeColor} text-[8px] font-black text-white uppercase`}>
                                                    {isBn ? product.badgeBn : product.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <h4 className="text-xs font-bold mb-1 truncate">{isBn ? product.nameBn : product.nameEn}</h4>
                                        <p className="text-[10px] text-muted-foreground mb-3">{isBn ? product.unitBn : product.unit}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-black">৳{product.price}</span>
                                            <Button size="icon" variant="secondary" className="rounded-xl hover:bg-primary hover:text-white transition-colors" onClick={() => handleAddToCart(product)}>
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!showAllProducts && !selectedCategory && !searchQuery && (
                        <div className="mt-12 flex justify-center">
                            <Button variant="outline" onClick={handleViewAll} className="bg-card/50 hover:bg-card px-8 py-3 rounded-2xl font-bold text-sm">
                                {t.showMoreSurprises} <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </section>

                {/* ===== TESTIMONIALS ===== */}
                <section className="mb-16 animate-slide-up">
                    <h2 className="text-2xl font-black mb-8">{t.whatPeopleSay}</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {REVIEWS.map((review, i) => (
                            <Card key={i} className="border">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-1 text-yellow-400 mb-4">
                                        {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <p className="text-xs italic text-muted-foreground mb-6">{isBn ? review.textBn : review.textEn}</p>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10"><AvatarImage src={review.avatar} alt={review.name} /><AvatarFallback>{review.name[0]}</AvatarFallback></Avatar>
                                        <div>
                                            <p className="text-xs font-black">{isBn ? review.nameBn : review.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{t.verifiedCustomer}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="bg-secondary pt-16 pb-8 border-t">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
                        <div className="col-span-2 lg:col-span-2">
                            <span className="text-primary font-extrabold text-2xl tracking-tighter">{t.appName}</span>
                            <p className="text-xs text-muted-foreground max-w-xs mt-4 mb-6">{t.footerDescription}</p>
                            <div className="flex gap-4 text-muted-foreground">
                                <span className="material-icons cursor-pointer hover:text-primary transition-colors">facebook</span>
                                <span className="material-icons cursor-pointer hover:text-primary transition-colors">camera_alt</span>
                                <span className="material-icons cursor-pointer hover:text-primary transition-colors">alternate_email</span>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-xs font-black mb-4 uppercase">{t.company}</h5>
                            <ul className="text-[10px] space-y-3 text-muted-foreground">
                                <li><a className="hover:text-primary cursor-pointer">{t.aboutUs}</a></li>
                                <li><a className="hover:text-primary cursor-pointer">{t.becomeRider}</a></li>
                                <li><a className="hover:text-primary cursor-pointer">{t.merchantPartner}</a></li>
                                <li><a className="hover:text-primary cursor-pointer">{t.career}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-xs font-black mb-4 uppercase">{t.support}</h5>
                            <ul className="text-[10px] space-y-3 text-muted-foreground">
                                <li><a className="hover:text-primary cursor-pointer">{t.helpCenter}</a></li>
                                <li><a className="hover:text-primary cursor-pointer">{t.safetyCenter}</a></li>
                                <li><a className="hover:text-primary cursor-pointer">{t.privacyPolicy}</a></li>
                                <li><a className="hover:text-primary cursor-pointer">{t.termsOfService}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-xs font-black mb-4 uppercase">{t.downloadApp}</h5>
                            <div className="space-y-3">
                                <div className="bg-foreground text-background px-3 py-1.5 rounded-lg flex items-center gap-2 border border-border cursor-pointer hover:opacity-80 transition-opacity">
                                    <Smartphone className="w-5 h-5" />
                                    <div className="leading-none"><p className="text-[8px]">Download on</p><p className="text-[10px] font-bold">App Store</p></div>
                                </div>
                                <div className="bg-foreground text-background px-3 py-1.5 rounded-lg flex items-center gap-2 border border-border cursor-pointer hover:opacity-80 transition-opacity">
                                    <Smartphone className="w-5 h-5" />
                                    <div className="leading-none"><p className="text-[8px]">Get it on</p><p className="text-[10px] font-bold">Google Play</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Separator className="mb-8" />
                    <p className="text-[10px] text-muted-foreground text-center">{t.allRightsReserved}</p>
                </div>
            </footer>

            {/* ===== MOBILE FAB ===== */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <Button onClick={() => setShowCart(true)} className="bg-yellow-400 hover:bg-yellow-500 text-black w-14 h-14 rounded-full shadow-2xl border-4 border-card relative" size="icon">
                    <ShoppingCart className="w-6 h-6" />
                    {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cart.length}</span>}
                </Button>
            </div>

            {/* ===== MODALS ===== */}
            {showCustomOrder && <CustomOrderModal onClose={() => setShowCustomOrder(false)} onLoginRequired={() => { setShowCustomOrder(false); setShowAuth(true); }} />}
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
            {showCart && <CartDrawer onClose={() => setShowCart(false)} onLoginRequired={() => { setShowCart(false); setShowAuth(true); }} />}
        </div>
    );
}
