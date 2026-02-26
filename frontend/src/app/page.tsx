import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'DeliveryHobe! | 24/7 Emergency Delivery Service',
  description: 'Get anything delivered from your local dokans in as fast as 98 mins! From snacks to emergency meds, we have you covered. Order from anywhere in Dhaka.',
  keywords: ['delivery', 'dhaka', 'grocery', 'pharmacy', 'emergency delivery', 'bangladesh'],
  alternates: { canonical: 'https://deliveryhobe.com' },
  openGraph: {
    title: 'DeliveryHobe! — 24/7 Emergency Delivery',
    description: 'Get anything delivered from your local dokans fast! Groceries, medicine, electronics.',
    type: 'website',
    locale: 'bn_BD',
    siteName: 'DeliveryHobe!',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DeliveryHobe!',
  url: 'https://deliveryhobe.com',
  description: '24/7 Emergency Delivery Service in Dhaka, Bangladesh',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://deliveryhobe.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

/**
 * Root page — Server Component
 * Metadata + SEO only. HomeClient handles all UI + state.
 */
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
