'use client';

import { useState } from 'react';
import { Send, BellRing, Users, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminNotificationsPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        targetAudience: 'all',
        deliveryMethod: 'both' // sms, push, both
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.message) {
            toast.error('Please fill in title and message');
            return;
        }

        setLoading(true);
        // Simulate sending notifications
        setTimeout(() => {
            toast.success(`Notification sent successfully to ${formData.targetAudience === 'all' ? 'all users' : formData.targetAudience}!`);
            setFormData({ ...formData, title: '', message: '' });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-foreground font-bangla">Push & SMS Notifications</h1>
                <p className="text-sm text-muted-foreground">Broadcast alerts and promos to customers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Form Section */}
                <div className="md:col-span-2 bg-card rounded-xl shadow-sm border border-border p-6">
                    <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2"><BellRing size={20} /> Compose Message</h2>

                    <form onSubmit={handleSend} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Notification Title</label>
                            <input
                                type="text" name="title" value={formData.title} onChange={handleChange} required
                                placeholder="e.g. Flash Sale on Groceries!"
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 font-bangla text-foreground"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Message Body</label>
                            <textarea
                                name="message" value={formData.message} onChange={handleChange} required rows={4}
                                placeholder="Write your message here in English or Bangla..."
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 font-bangla text-foreground"
                            />
                            <p className="text-xs text-muted-foreground mt-1 text-right">{formData.message.length} characters (1 SMS prep)</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Target Audience</label>
                                <select
                                    name="targetAudience" value={formData.targetAudience} onChange={handleChange}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 text-foreground"
                                >
                                    <option value="all">All Active Customers</option>
                                    <option value="recent">Recent Buyers (30 days)</option>
                                    <option value="inactive">Inactive Customers</option>
                                    <option value="dhanmondi">Zone: Dhanmondi</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Delivery Method</label>
                                <select
                                    name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-red-500 text-foreground"
                                >
                                    <option value="push">Push Notification Only</option>
                                    <option value="sms">SMS Only</option>
                                    <option value="both">Push & SMS (High Cost)</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-70"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={18} />}
                                Send Broadcast
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Sidebar Section */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-5">
                        <h3 className="font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2 mb-3"><Users size={18} /> Audience Reach</h3>
                        <p className="text-sm text-blue-600/80 dark:text-blue-200/60 mb-4">You are about to send a notification to a segment of your users.</p>
                        <div className="bg-white dark:bg-card p-3 rounded-lg border border-border flex justify-between items-center shadow-sm">
                            <span className="text-sm font-medium text-muted-foreground">Estimated</span>
                            <span className="font-bold text-foreground text-lg">~4,200</span>
                        </div>
                    </div>

                    <div className="bg-muted/40 rounded-xl border border-border p-5">
                        <h3 className="font-bold text-foreground flex items-center gap-2 mb-3"><Smartphone size={18} /> Live Preview</h3>
                        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden mt-4">
                            <div className="bg-muted p-2 border-b border-border flex items-center gap-2">
                                <div className="w-5 h-5 rounded overflow-hidden bg-red-500 flex items-center justify-center">
                                    <span className="text-white text-[10px] font-bold">Q</span>
                                </div>
                                <span className="text-xs font-semibold text-foreground">QuickDeli</span>
                                <span className="text-[10px] text-muted-foreground ml-auto">Now</span>
                            </div>
                            <div className="p-3">
                                <h4 className="font-bold text-sm text-foreground font-bangla mb-1">{formData.title || 'Notification Title'}</h4>
                                <p className="text-xs text-muted-foreground font-bangla leading-relaxed line-clamp-3">
                                    {formData.message || 'The notification message body will appear here as a preview...'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
