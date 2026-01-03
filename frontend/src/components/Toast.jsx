import React, { useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function Toast({ message, onClose, duration = 2000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
            <div className="bg-surface border border-white/20 rounded-lg shadow-2xl p-4 flex items-center gap-3 min-w-[300px]">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-sm font-medium text-white flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                >
                    <X className="w-4 h-4 text-text-muted" />
                </button>
            </div>
        </div>
    );
}
