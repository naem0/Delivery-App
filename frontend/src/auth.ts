import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            id: "login",
            name: "Login",
            credentials: {
                phone: { label: "Phone", type: "tel" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${API_BASE}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            phone: credentials?.phone,
                            password: credentials?.password,
                        }),
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) return null;
                    return {
                        id: data.user._id,
                        name: data.user.name,
                        email: data.user.email || undefined,
                        phone: data.user.phone,
                        role: data.user.role,
                        backendToken: data.token,
                    };
                } catch {
                    return null;
                }
            },
        }),
        Credentials({
            id: "register",
            name: "Register",
            credentials: {
                phone: { label: "Phone", type: "tel" },
                password: { label: "Password", type: "password" },
                name: { label: "Name", type: "text" },
                email: { label: "Email", type: "email" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${API_BASE}/auth/register`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            phone: credentials?.phone,
                            password: credentials?.password,
                            name: credentials?.name,
                            email: credentials?.email || "",
                        }),
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) return null;
                    return {
                        id: data.user._id,
                        name: data.user.name,
                        email: data.user.email || undefined,
                        phone: data.user.phone,
                        role: data.user.role,
                        backendToken: data.token,
                    };
                } catch {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.phone = (user as any).phone;
                token.role = (user as any).role;
                token.backendToken = (user as any).backendToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).phone = token.phone;
                (session.user as any).role = token.role;
                (session.user as any).backendToken = token.backendToken;
            }
            return session;
        },
    },
    pages: {
        signIn: "/", // Use our custom modal, not a separate page
    },
    session: { strategy: "jwt" },
});
