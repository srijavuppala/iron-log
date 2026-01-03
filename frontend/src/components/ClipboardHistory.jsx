import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

export default function ClipboardHistory({ onClose, onSelect }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Load clipboard history from localStorage
        const saved = localStorage.getItem('ironlog_clipboard_history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load clipboard history', e);
            }
        }
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // Less than 1 minute
        if (diff < 60000) return 'Just now';
        // Less than 1 hour
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        // Less than 1 day
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        // Otherwise show date
        return date.toLocaleDateString();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-surface border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-surfaceHighlight/20">
                    <div>
                        <h2 className="text-xl font-heading font-bold uppercase tracking-wider text-white">
                            Clipboard History
                        </h2>
                        <p className="text-sm text-text-muted">Your recent workout shares</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {history.length === 0 ? (
                        <div className="text-center py-12 text-text-muted">
                            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No clipboard history yet</p>
                            <p className="text-sm mt-2">Share a workout to see it here</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        onSelect(item.text);
                                        onClose();
                                    }}
                                    className="w-full text-left p-4 bg-background hover:bg-surfaceHighlight border border-white/10 rounded-lg transition-colors group"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">
                                                {item.text.split('\\n')[0]}
                                            </p>
                                        </div>
                                        <span className="text-xs text-text-muted whitespace-nowrap">
                                            {formatDate(item.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-muted line-clamp-2 font-mono">
                                        {item.text}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-white/10 bg-surfaceHighlight/10">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2 hover:bg-white/5 rounded-lg text-sm font-bold transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
