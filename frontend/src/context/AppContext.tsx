'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '@/lib/translations';

interface User {
    _id: string;
    phone: string;
    name: string;
    email?: string;
    role: string;
    preferredLanguage: Language;
    theme: string;
}

interface CartItem {
    productId?: string;
    productNameEn: string;
    productNameBn: string;
    quantity: number;
    unit: string;
    unitBn: string;
    shopPreference?: string;
    priceEstimate?: number;
    image?: string;
    isCustom?: boolean;
}

interface AppContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations.en;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    cartTotal: number;
    logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [language, setLanguage] = useState<Language>('bn');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        // Load from localStorage
        const savedToken = localStorage.getItem('qd_token');
        const savedUser = localStorage.getItem('qd_user');
        const savedLang = localStorage.getItem('qd_lang') as Language;
        const savedTheme = localStorage.getItem('qd_theme') as 'light' | 'dark';
        const savedCart = localStorage.getItem('qd_cart');

        if (savedToken) setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedLang) setLanguage(savedLang);
        if (savedCart) setCart(JSON.parse(savedCart));

        // Theme: saved preference or system
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('qd_theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('qd_lang', language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('qd_cart', JSON.stringify(cart));
    }, [cart]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const t = translations[language];

    const addToCart = (item: CartItem) => {
        setCart(prev => [...prev, item]);
    };

    const removeFromCart = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, item) => sum + (item.priceEstimate || 0) * item.quantity, 0);

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('qd_token');
        localStorage.removeItem('qd_user');
        setCart([]);
    };

    const handleSetToken = (t: string | null) => {
        setToken(t);
        if (t) localStorage.setItem('qd_token', t);
        else localStorage.removeItem('qd_token');
    };

    const handleSetUser = (u: User | null) => {
        setUser(u);
        if (u) localStorage.setItem('qd_user', JSON.stringify(u));
        else localStorage.removeItem('qd_user');
    };

    return (
        <AppContext.Provider value={{
            user, setUser: handleSetUser,
            token, setToken: handleSetToken,
            language, setLanguage,
            t,
            theme, toggleTheme,
            cart, addToCart, removeFromCart, clearCart,
            cartTotal,
            logout,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}
