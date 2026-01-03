import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Dumbbell } from 'lucide-react';

export default function Landing() {
    const { handleGoogleLogin } = useAuth();

    // TEMPORARY: Dev bypass while OAuth propagates
    const devBypass = () => {
        const fakeCredential = {
            credential: "dev_bypass_token"
        };
        handleGoogleLogin(fakeCredential);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-main relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px]" />

            <div className="z-10 flex flex-col items-center gap-8 text-center px-4">
                <div className="flex items-center gap-2 mb-4 animate-fade-in">
                    <Dumbbell className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl font-heading font-bold tracking-tighter">IRONLOG</h1>
                </div>

                <p className="text-xl text-text-muted max-w-md animate-slide-up">
                    Track your workouts without the rigid schedules.
                    <span className="text-text-main font-semibold"> Push. Pull. Legs. Core. Cardio.</span>
                    <br />Any day, your way.
                </p>

                <div className="mt-8 scale-125 transform hover:scale-[1.3] transition-transform">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                            console.log('Login Failed');
                            alert('Login failed. Please try again.');
                        }}
                        useOneTap
                        theme="filled_black"
                        size="large"
                        text="continue_with"
                        shape="pill"
                    />
                </div>

                {/* TEMPORARY: Dev bypass button */}
                <button
                    onClick={devBypass}
                    className="mt-4 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors"
                >
                    🔧 Dev Bypass (Test Mode)
                </button>

                <p className="text-xs text-text-muted mt-8 opacity-50">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
