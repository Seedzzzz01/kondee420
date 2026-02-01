'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

function LoginContent() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/admin';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push(callbackUrl);
                router.refresh(); // Ensure middleware sees the new cookie
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#E6F3FF] via-[#F0F7FF] to-[#FFFFFF] flex items-center justify-center py-12 px-4">
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-200 blur-[100px]" />
            </div>

            <div className="relative z-20">
                <LanguageToggle />
            </div>

            <div className="container relative z-10 w-full max-w-md">
                <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(74,169,233,0.15)] border border-blue-100 animate-in fade-in zoom-in duration-500">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 mb-6 text-4xl shadow-sm">
                            🛡️
                        </div>
                        <h1 className="text-3xl font-extrabold mb-3 text-[#1a3a4a]">
                            {t.adminLoginTitle}
                        </h1>
                        <p className="text-[#6b8a9a]">
                            {t.adminLoginSubtitle}
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#6b8a9a] ml-1">{t.username}</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-[#F0F7FF] border border-blue-100 text-[#1a3a4a] focus:outline-none focus:ring-2 focus:ring-[#4AA9E9]/20 focus:border-[#4AA9E9] transition-all"
                                placeholder={t.usernamePlaceholder}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#6b8a9a] ml-1">{t.password}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-[#F0F7FF] border border-blue-100 text-[#1a3a4a] focus:outline-none focus:ring-2 focus:ring-[#4AA9E9]/20 focus:border-[#4AA9E9] transition-all"
                                placeholder={t.passwordPlaceholder}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm text-center font-medium">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 text-lg font-bold rounded-xl text-white bg-gradient-to-r from-[#4AA9E9] to-[#5BC0DE] shadow-lg shadow-blue-400/30 hover:shadow-blue-400/40 hover:translate-y-[-2px] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? <div className="spinner mx-auto border-white/30 border-t-white" /> : t.signIn}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.push('/')}
                            className="text-sm text-[#6b8a9a] hover:text-[#4AA9E9] transition-colors font-medium"
                        >
                            ← {t.backToPortal}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-gradient-to-br from-[#E6F3FF] to-[#FFFFFF] flex items-center justify-center">
                <div className="spinner border-blue-200 border-t-[#4AA9E9]" />
            </main>
        }>
            <LoginContent />
        </Suspense>
    );
}
