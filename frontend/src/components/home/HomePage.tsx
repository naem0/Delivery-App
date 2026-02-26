import HomeClient from './HomeClient';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.categories || [];
    } catch {
        return [];
    }
}

async function getProducts() {
    try {
        const res = await fetch(`${API_BASE}/products?popular=true&limit=20`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.products || [];
    } catch {
        return [];
    }
}

/**
 * HomePage — Server Component
 * Fetches categories + products from the API on the server,
 * then passes serialized data to the client-side HomeClient.
 */
export default async function HomePage() {
    const [categories, products] = await Promise.all([
        getCategories(),
        getProducts(),
    ]);

    return <HomeClient categories={categories} products={products} />;
}
