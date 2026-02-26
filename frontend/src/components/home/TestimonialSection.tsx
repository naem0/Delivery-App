'use client';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const REVIEWS = [
    { name: 'Sohan E.', nameBn: 'সোহান ই.', textEn: '"Blackout in the area, still got candles and batteries delivered. DeliveryHobe works when others don\'t!"', textBn: '"এলাকায় ব্ল্যাকআউট, তবুও মোমবাতি আর ব্যাটারি পেয়ে গেলাম। ডেলিভারিহবে কাজ করে যখন অন্যরা পারে না!"', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_23lnojx6BO012f5AgJIZ2vPdmsYHsX-NH6_xwfU8PIwPCJTU6uIARa3TfkR34EzpztzuOIhiHdC2Ucq-QXrLAcVH9yJPaK1sV2VpFDcuNDYcLRxNdKMibYd9aO3ZeB7mLOEV_7-yAKvIrlKkgL3bL-_djQCD63w31J_CN1jHWfP6qne_Shc0EIM2a07TuqGFGkmEvlICCDxhFFGCgLc5E0eG3SD7SB_ACUzNIKyDfoLKMLYVPaDQ3NviQi6H2kqRE_spVKzPXRzK' },
    { name: 'Ehsanur R.', nameBn: 'এহসানুর আর.', textEn: '"Emergency meds delivered in 20 mins during hartal. This app is a blessing for emergencies!"', textBn: '"হরতালের সময় ২০ মিনিটে জরুরি ওষুধ পেয়ে গেলাম। জরুরি সময়ে এই অ্যাপ আশীর্বাদ!"', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkL6JSZtB__F71E_CdYM1uftClwg35z3ree7_N-9BUkwOxaHhMQCIVXRvohD1hYE8xRxW_819xiD5ZYmBAO1M7vJkpCw4g3l_ublXKwdpWVq_DNcieiHmgBR1tZi4EEPsheRTA96J1i6Wv_TpejNvnkQKXzbM6TSlMIzfI-NbwlGfxNZwsGTQ7SDpYMbwLpVjG3oaUGsiU-GI9En4j_2vQAl20tQGjv445Kp-Xdfbax-PZULclImCgG0U3meHA39si1ndMroPisp0t' },
    { name: 'Saroar S.', nameBn: 'সারোয়ার এস.', textEn: '"Can\'t believe I got fresh bhelpuri at 2 AM! DeliveryHobe saved my late-night cravings. Super fast!"', textBn: '"রাত ২টায় ভেলপুরি পেয়ে গেলাম! ডেলিভারিহবে আমার রাতের ক্ষুধা মিটিয়ে দিল। দারুণ দ্রুত!"', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWUMRDI90vxlHZe61JwMCvzZ5xAQ6Ks0PvMYVhAfO9nEPqhyLO917XmpFXStXxeJKFkpgJC679s1BPo1UmFPJR-NBYPMIy36Hq75dwH_PQYLtRSU2YXwuNkHUiA5mo7bDSS4ji2BiQFzLZVfU-V5d4gdW9hMadskE-XjE16TrFekaTQGvqw6yW2cn61Q7GgA2PzgSevTq5D_HEHzPQ2HeALj4g4okSXg6lvQ-tlsXNtIHsQu8m7QjHxVV-7wOkMGKtN-_BicuApB7l' },
];

export default function TestimonialSection() {
    const { t, language } = useApp();
    const isBn = language === 'bn';

    return (
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
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={review.avatar} alt={review.name} />
                                    <AvatarFallback>{review.name[0]}</AvatarFallback>
                                </Avatar>
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
    );
}
