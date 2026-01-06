import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for classes
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Input = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon size={18} />
        </div>
        <input
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            {...props}
        />
    </div>
);

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const res = isLogin
            ? await login(email, password)
            : await register(name, email, password);

        if (!res.success) {
            setError(res.error);
        }
        setIsLoading(false);
    };

    return (
        <div className="w-full max-w-sm mx-auto bg-surface/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl">
            <div className="flex bg-surface rounded-lg p-1 mb-6">
                <button
                    onClick={() => setIsLogin(true)}
                    className={cn(
                        "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                        isLogin ? "bg-primary text-background shadow-lg" : "text-text-muted hover:text-text-main"
                    )}
                >
                    Login
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={cn(
                        "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                        !isLogin ? "bg-primary text-background shadow-lg" : "text-text-muted hover:text-text-main"
                    )}
                >
                    Sign Up
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <Input
                        icon={User}
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                )}

                <Input
                    icon={Mail}
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                        <Lock size={18} />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full bg-surface border border-border rounded-lg pl-10 pr-10 py-2 text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-background font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {isLoading && <Loader2 className="animate-spin" size={18} />}
                    {isLogin ? 'Sign In' : 'Create Account'}
                </button>
            </form>
        </div>
    );
}
