import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Check if user is authenticated and has admin role
    if (!session || !session.user) {
        redirect('/');
    }

    if ((session.user as any).role !== 'admin') {
        redirect('/');
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans">
            <AdminSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
