'use client';
import { useApp } from '@/context/AppContext';

export default function TopBanner() {
    const { t } = useApp();
    return (
        <div className="bg-emerald-600 text-white text-[10px] md:text-xs font-bold py-1.5 text-center uppercase tracking-widest">
            {t.wereOpen}
        </div>
    );
}
