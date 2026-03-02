'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingCart,
    Grid,
    Package,
    Users,
    Bike,
    Store,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Sun,
    Moon
} from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useApp } from '@/context/AppContext';

const MENU_ITEMS = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Categories', href: '/admin/categories', icon: Grid },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Riders', href: '/admin/riders', icon: Bike },
    { name: 'Shops', href: '/admin/shops', icon: Store },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useApp();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-card border-border border-b sticky top-0 z-50">
                <span className="text-xl font-bold font-bangla text-red-600">QuickDeli Admin</span>
                <button onClick={toggleSidebar} className="p-2 text-foreground">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar content */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
                <div className="p-6 hidden md:block">
                    <span className="text-2xl font-bold font-bangla text-red-600">QuickDeli</span>
                    <span className="ml-2 text-sm text-muted-foreground font-semibold uppercase tracking-wider">Admin</span>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        {MENU_ITEMS.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                                        flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                        ${isActive
                                            ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-500'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }
                                    `}
                                >
                                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-red-500' : 'text-gray-400'}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-border space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {theme === 'dark' ? (
                            <Sun className="mr-3 h-5 w-5 text-gray-400" />
                        ) : (
                            <Moon className="mr-3 h-5 w-5 text-gray-400" />
                        )}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
}
