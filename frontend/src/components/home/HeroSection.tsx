'use client';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
    onCustomOrderClick: () => void;
}

export default function HeroSection({ onCustomOrderClick }: HeroSectionProps) {
    const { t, language } = useApp();
    const isBn = language === 'bn';

    return (
        <section className="grid lg:grid-cols-12 gap-8 mb-16 animate-fade-in">
            {/* Left: Text + Custom Order */}
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
                            <Textarea
                                className="flex-1 bg-secondary/50 rounded-2xl p-4 text-sm min-h-[100px] resize-none border-border focus-visible:ring-primary cursor-pointer"
                                placeholder={t.customOrderPlaceholder}
                                onClick={onCustomOrderClick}
                                readOnly
                            />
                            <Button
                                onClick={onCustomOrderClick}
                                className="bg-primary hover:bg-red-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg text-base"
                                size="lg"
                            >
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

            {/* Right: Hero Image */}
            <div className="lg:col-span-5 relative group hidden lg:block">
                <div className="aspect-[4/3] bg-primary rounded-3xl overflow-hidden shadow-2xl relative">
                    <img
                        alt="Delivery Guy"
                        className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFgm4ohatiXZVJlKoWJHSzTHnyeRvGCUd_aTTqi9Ypxl78Th-K6BGaI9YjiyfD9LJWY4ra2CwLE8K3vcDNw_EbRMcvuM0ukEbBsshH2MOaLqvUBDXcef5JCF3vtfJKTbQ2CgkpSbzxnUX5VnNN2LFoAoCC-Q9oRDvacByhAP2VqXazShjVZa8JsETcNyCAwzWapghOg0KgV_4JYqjF2HO2DMJb11jtozTsR1_69VKNsS7uwDKsS9q6bC6D1si1d5RnD9fw10lxh3-O"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                        <Badge className="bg-yellow-400 text-black text-[10px] font-black w-fit mb-2 uppercase tracking-tighter hover:bg-yellow-500">
                            {isBn ? 'সীমিত অফার' : 'Limited Offer'}
                        </Badge>
                        <h2 className="text-3xl font-black text-white mb-2 italic">DELIVERY HOBE!</h2>
                        <p className="text-white/80 font-bold text-xl">01623-088935 💬</p>
                    </div>
                </div>
                <div className="flex justify-center gap-1.5 mt-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                </div>
            </div>
        </section>
    );
}
