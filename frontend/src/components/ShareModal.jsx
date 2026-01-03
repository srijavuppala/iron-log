import React, { useState, useEffect } from 'react';
import { X, Copy, Share2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function ShareModal({ date, workout, onClose, onCopied, onShowHistory }) {
    const [editableText, setEditableText] = useState('');

    useEffect(() => {
        // Generate the formatted workout text
        const formattedDate = format(new Date(date), 'EEEE, MMMM d, yyyy');
        const workoutType = workout.type || 'Workout';
        const exercises = workout.exercises || [];
        const weightUnit = workout.weight_unit || 'lbs';

        const text = `${formattedDate} - ${workoutType}\n\n` +
            exercises.map(e => `${e.name}: ${e.sets}x${e.reps} @ ${e.weight}${weightUnit}`).join('\n');

        setEditableText(text);
    }, [date, workout]);

    const saveToHistory = (text) => {
        const history = JSON.parse(localStorage.getItem('ironlog_clipboard_history') || '[]');
        history.unshift({ text, timestamp: Date.now() });
        // Keep only last 20 items
        const trimmed = history.slice(0, 20);
        localStorage.setItem('ironlog_clipboard_history', JSON.stringify(trimmed));
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(editableText);
            saveToHistory(editableText);
            onCopied('Copied to clipboard!');
            onClose();
        } catch (err) {
            console.error('Failed to copy:', err);
            onCopied('Failed to copy to clipboard');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${workout.type} Workout`,
                    text: editableText,
                });
                saveToHistory(editableText);
                onClose();
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Failed to share:', err);
                    // Fallback to copy
                    handleCopy();
                }
            }
        } else {
            // Fallback to copy if Web Share API not available
            handleCopy();
        }
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
                            Share Workout
                        </h2>
                        <p className="text-sm text-text-muted">Edit and share your training</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Editable Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <label className="text-xs uppercase font-bold tracking-wider text-text-muted mb-2 block">
                        Workout Details (Editable)
                    </label>
                    <textarea
                        value={editableText}
                        onChange={(e) => setEditableText(e.target.value)}
                        className="w-full h-48 sm:h-64 bg-background border border-white/10 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-white font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        placeholder="Add your workout details here..."
                    />
                    <p className="text-xs text-text-muted mt-2">
                        💡 Tip: You can add extra exercises, notes, or modify the text before sharing
                    </p>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 sm:justify-between bg-surfaceHighlight/10">
                    <button
                        onClick={onShowHistory}
                        className="px-4 py-2 hover:bg-white/5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors justify-center sm:justify-start"
                    >
                        <Clock className="w-4 h-4" />
                        VIEW HISTORY
                    </button>

                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        <button
                            onClick={handleCopy}
                            className="px-6 py-2 bg-surfaceHighlight hover:bg-surface border border-white/10 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                            <Copy className="w-4 h-4" />
                            COPY
                        </button>
                        {navigator.share && (
                            <button
                                onClick={handleShare}
                                className="px-6 py-2 bg-white text-black hover:bg-gray-200 rounded-lg text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-95"
                            >
                                <Share2 className="w-4 h-4" />
                                SHARE
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
