import HomeWrapper from '@/components/home/HomeWrapper';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Fetch categories from backend API (server-side)
async function getCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`, {
            next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
        });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        return data.categories || [];
    } catch (error) {
        console.error('❌ Failed to fetch categories:', error);
        return [];
    }
}

// Fetch products from backend API (server-side)
async function getProducts() {
    try {
        const res = await fetch(`${API_BASE}/products?limit=50`, {
            next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        return data.products || [];
    } catch (error) {
        console.error('❌ Failed to fetch products:', error);
        return [];
    }
}

/**
 * HomeClient — SERVER Component (async)
 *
 * This is the main page component that:
 * 1. Fetches categories and products from the backend API (server-side)
 * 2. Passes the data to HomeWrapper (client component) for interactivity
 *
 * All API calls happen on the server. No API calls in the browser.
 * Data is cached with ISR (revalidate: 60s) for performance.
 */
export default async function HomeClient() {
    // Parallel server-side data fetching
    const [categories, products] = await Promise.all([
        getCategories(),
        getProducts(),
    ]);

    return (
        <HomeWrapper
            categories={categories}
            products={products}
        />
    );
}
