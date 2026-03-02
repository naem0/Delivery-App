'use client';
import { useApp } from '@/context/AppContext';
import { Separator } from '@/components/ui/separator';
import { Smartphone } from 'lucide-react';

export default function FooterSection() {
    const { t } = useApp();

    return (
        <footer className="bg-secondary pt-16 pb-8 border-t">
            <div className="container mx-auto">
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
    );
}
