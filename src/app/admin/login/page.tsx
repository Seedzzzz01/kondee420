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
        <main className="min-h-screen relative overflow-hidden bg-[#050510] text-white flex items-center justify-center py-12 px-4">
            <div className="animated-bg" />
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <LanguageToggle />

            <div className="container relative z-10 w-full max-w-md">
                <div className="glass-card p-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 text-4xl">
                            🛡️
                        </div>
                        <h1 className="text-3xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                            {t.adminLoginTitle}
                        </h1>
                        <p className="text-blue-200/50">
                            {t.adminLoginSubtitle}
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-blue-200/70 ml-1">{t.username}</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-input w-full"
                                placeholder={t.usernamePlaceholder}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-blue-200/70 ml-1">{t.password}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input w-full"
                                placeholder={t.passwordPlaceholder}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-sm text-center">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-full py-4 text-lg font-bold"
                            disabled={loading}
                            style={{
                                boxShadow: '0 8px 30px -10px rgba(124, 92, 255, 0.5)'
                            }}
                        >
                            {loading ? <div className="spinner mx-auto" /> : t.signIn}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.push('/')}
                            className="text-sm text-blue-200/40 hover:text-purple-400 transition-colors"
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
            <main className="min-h-screen bg-[#050510] flex items-center justify-center">
                <div className="spinner" />
            </main>
        }>
            <LoginContent />
        </Suspense>
    );
}
