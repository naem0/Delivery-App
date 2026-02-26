'use client';
import { useState } from 'react';
import { X, Phone, Lock, User, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

interface AuthModalProps {
    onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
    const { language } = useApp();
    const isBn = language === 'bn';

    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatPhone = (val: string) => val.replace(/[^0-9+]/g, '');

    const handleLogin = async () => {
        if (!phone || phone.length < 10) {
            toast.error(isBn ? 'সঠিক ফোন নম্বর দিন' : 'Enter a valid phone number');
            return;
        }
        if (!password || password.length < 6) {
            toast.error(isBn ? 'পাসওয়ার্ড কমপক্ষে ৬ সংখ্যার হতে হবে' : 'Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const result = await signIn('login', {
                phone,
                password,
                redirect: false,
            });
            if (result?.error) {
                toast.error(isBn ? 'ভুল ফোন নম্বর বা পাসওয়ার্ড' : 'Invalid phone or password');
            } else {
                toast.success(isBn ? 'লগইন সফল!' : 'Login successful!');
                onClose();
                window.location.reload();
            }
        } catch {
            toast.error(isBn ? 'লগইন ব্যর্থ হয়েছে' : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!name || name.trim().length < 2) {
            toast.error(isBn ? 'নাম দিন (কমপক্ষে ২ অক্ষর)' : 'Enter your name (min 2 characters)');
            return;
        }
        if (!phone || phone.length < 10) {
            toast.error(isBn ? 'সঠিক ফোন নম্বর দিন' : 'Enter a valid phone number');
            return;
        }
        if (!password || password.length < 6) {
            toast.error(isBn ? 'পাসওয়ার্ড কমপক্ষে ৬ সংখ্যার হতে হবে' : 'Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const result = await signIn('register', {
                phone,
                password,
                name: name.trim(),
                email: email.trim(),
                redirect: false,
            });
            if (result?.error) {
                toast.error(isBn ? 'রেজিস্ট্রেশন ব্যর্থ। ফোন নম্বর ইতিমধ্যে ব্যবহৃত হতে পারে।' : 'Registration failed. Phone may already be in use.');
            } else {
                toast.success(isBn ? 'রেজিস্ট্রেশন সফল!' : 'Registration successful!');
                onClose();
                window.location.reload();
            }
        } catch {
            toast.error(isBn ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে' : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (mode === 'login') handleLogin();
        else handleRegister();
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" onClick={onClose} />

            <Card className="relative z-10 w-full max-w-md animate-slide-up bg-card/90 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-400 to-primary" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl" />

                <CardContent className="p-8 relative">
                    {/* Close */}
                    <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 rounded-full w-8 h-8 bg-secondary/50 hover:bg-secondary">
                        <X className="w-4 h-4" />
                    </Button>

                    {/* Header */}
                    <div className="mb-6">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                            {mode === 'login' ? <Lock className="w-7 h-7 text-primary" /> : <User className="w-7 h-7 text-primary" />}
                        </div>
                        <h2 className="text-2xl font-extrabold">
                            {mode === 'login' ? (isBn ? 'লগইন করুন' : 'Welcome Back') : (isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {mode === 'login'
                                ? (isBn ? 'ফোন নম্বর ও পাসওয়ার্ড দিন' : 'Enter phone and password')
                                : (isBn ? 'নাম, ফোন ও পাসওয়ার্ড দিন' : 'Enter name, phone and password')
                            }
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-secondary rounded-2xl p-1 mb-6">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'login' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {isBn ? 'লগইন' : 'Login'}
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'register' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {isBn ? 'রেজিস্টার' : 'Register'}
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* Name (register only) */}
                        {mode === 'register' && (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder={isBn ? 'আপনার নাম *' : 'Your Name *'}
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="pl-11 h-12 rounded-2xl bg-secondary/50 border-border"
                                />
                            </div>
                        )}

                        {/* Phone */}
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="tel"
                                placeholder={isBn ? '০১XXXXXXXXX *' : '01XXXXXXXXX *'}
                                value={phone}
                                onChange={e => setPhone(formatPhone(e.target.value))}
                                maxLength={14}
                                className="pl-11 h-12 rounded-2xl bg-secondary/50 border-border tracking-wider"
                                dir="ltr"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder={isBn ? 'পাসওয়ার্ড *' : 'Password *'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                className="pl-11 pr-11 h-12 rounded-2xl bg-secondary/50 border-border"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Email (register only, optional) */}
                        {mode === 'register' && (
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder={isBn ? 'ইমেইল (ঐচ্ছিক)' : 'Email (optional)'}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="pl-11 h-12 rounded-2xl bg-secondary/50 border-border"
                                />
                            </div>
                        )}

                        {/* Submit */}
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full h-14 bg-primary hover:bg-red-600 text-white font-bold rounded-2xl text-base shadow-lg shadow-primary/25 mt-2"
                        >
                            {loading ? '...' : (mode === 'login'
                                ? (isBn ? 'লগইন' : 'Login')
                                : (isBn ? 'রেজিস্টার' : 'Register')
                            )}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>

                    <p className="text-[11px] text-muted-foreground mt-5 text-center">
                        {mode === 'login'
                            ? (isBn ? 'অ্যাকাউন্ট নেই? উপরে "রেজিস্টার" ক্লিক করুন।' : 'No account? Click "Register" above.')
                            : (isBn ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? উপরে "লগইন" ক্লিক করুন।' : 'Already have an account? Click "Login" above.')
                        }
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
