'use client';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, ShoppingCart, Globe, Moon, Sun, User, LogOut } from 'lucide-react';

interface HeaderNavProps {
    onCartClick: () => void;
    onAuthClick: () => void;
    searchQuery: string;
    onSearchChange: (q: string) => void;
}

export default function HeaderNav({ onCartClick, onAuthClick, searchQuery, onSearchChange }: HeaderNavProps) {
    const { t, cart, language, setLanguage, theme, toggleTheme, user, logout, cartTotal } = useApp();
    const isBn = language === 'bn';

    return (
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b px-4 py-3 md:px-8">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
                {/* Logo */}
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
                        onChange={e => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Location */}
                    <div className="hidden lg:flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full border">
                        <MapPin className="text-primary w-4 h-4" />
                        <div className="text-[10px]">
                            <p className="text-muted-foreground leading-none">{t.deliveringTo}</p>
                            <p className="font-bold truncate max-w-[120px]">Dhaka, Dhanmondi R/A</p>
                        </div>
                    </div>

                    {/* Language Toggle */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLanguage(isBn ? 'en' : 'bn')}
                        className="rounded-full text-xs font-bold px-3 gap-1"
                    >
                        <Globe className="w-3.5 h-3.5" />
                        {isBn ? 'EN' : 'বাং'}
                    </Button>

                    {/* Dark/Light Toggle */}
                    <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full w-8 h-8">
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>

                    {/* User/Login */}
                    {user ? (
                        <Button variant="ghost" size="sm" onClick={logout} className="rounded-full text-xs gap-1 hidden md:flex">
                            <LogOut className="w-3.5 h-3.5" /> {t.logout}
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={onAuthClick} className="rounded-full text-xs gap-1 hidden md:flex">
                            <User className="w-3.5 h-3.5" /> {t.login}
                        </Button>
                    )}

                    {/* Cart Button */}
                    <Button
                        onClick={onCartClick}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-3 md:px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span className="text-sm ml-1 hidden sm:inline">৳ {cartTotal.toLocaleString()}</span>
                        <Badge variant="secondary" className="ml-1 bg-black/10 text-[10px] hidden sm:inline-flex">
                            {cart.length} {t.items}
                        </Badge>
                    </Button>
                </div>
            </div>
        </header>
    );
}
