'use client';

import { useState } from 'react';
import { Save, Settings2, ShieldCheck, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);

    // Initial mocked settings
    const [settings, setSettings] = useState({
        deliveryCharge: 60,
        minimumOrder: 100,
        serviceArea: 'Dhaka City',
        appName: 'QuickDeli',
        supportPhone: '01XXXXXXXXX',
        promoActive: true,
        appBannerText: 'Get 24/7 delivery on all groceries!',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;

        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulating API call since backend model for Settings may not exist yet
        setTimeout(() => {
            toast.success('Settings saved successfully!');
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-foreground font-bangla">App Settings</h1>
                <p className="text-sm text-muted-foreground">Global configuration for QuickDeli platform</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">

                {/* General Settings */}
                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                    <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
                        <Settings2 className="text-muted-foreground" size={20} />
                        <h2 className="text-lg font-bold text-foreground">General Info</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">App Name</label>
                            <input
                                type="text" name="appName" value={settings.appName} onChange={handleChange} required
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 text-foreground"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Support Phone</label>
                            <input
                                type="tel" name="supportPhone" value={settings.supportPhone} onChange={handleChange} required
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 text-foreground"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-1">App Top Banner Text</label>
                            <textarea
                                name="appBannerText" value={settings.appBannerText} onChange={handleChange} rows={2}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 text-foreground"
                            />
                        </div>
                    </div>
                </div>

                {/* Operations & Pricing */}
                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                    <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
                        <DollarSign className="text-muted-foreground" size={20} />
                        <h2 className="text-lg font-bold text-foreground">Operations & Pricing</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Default Delivery Charge (৳)</label>
                            <input
                                type="number" name="deliveryCharge" value={settings.deliveryCharge} onChange={handleChange} required min="0"
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 text-foreground"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Minimum Order Amount (৳)</label>
                            <input
                                type="number" name="minimumOrder" value={settings.minimumOrder} onChange={handleChange} required min="0"
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 text-foreground"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Active Service Area</label>
                            <input
                                type="text" name="serviceArea" value={settings.serviceArea} onChange={handleChange} required
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 text-foreground"
                                placeholder="e.g. Dhaka City, Uttara..."
                            />
                        </div>
                        <div className="flex items-center mt-6">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox" name="promoActive" checked={settings.promoActive} onChange={handleChange}
                                    className="w-5 h-5 rounded text-red-600 focus:ring-red-500 border-border bg-background"
                                />
                                <span className="text-sm font-medium text-foreground">Enable Promotional Banners on App</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-70"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
                        Save Configuration
                    </button>
                </div>
            </form>
        </div>
    );
}
