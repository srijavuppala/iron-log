import React, { useState } from 'react';
import { X, Plus, Trash2, Palette } from 'lucide-react';

const COLOR_OPTIONS = [
    { name: 'Purple', class: 'bg-purple-500', hex: '#a855f7' },
    { name: 'Orange', class: 'bg-orange-500', hex: '#f97316' },
    { name: 'Pink', class: 'bg-pink-500', hex: '#ec4899' },
    { name: 'Teal', class: 'bg-teal-500', hex: '#14b8a6' },
    { name: 'Indigo', class: 'bg-indigo-500', hex: '#6366f1' },
    { name: 'Yellow', class: 'bg-yellow-500', hex: '#eab308' },
    { name: 'Emerald', class: 'bg-emerald-500', hex: '#10b981' },
    { name: 'Rose', class: 'bg-rose-500', hex: '#f43f5e' },
];

export default function CustomTypeModal({ onClose, onSave, editingType = null }) {
    const [name, setName] = useState(editingType?.label || '');
    const [selectedColor, setSelectedColor] = useState(editingType?.color || COLOR_OPTIONS[0].class);
    const [exercises, setExercises] = useState(editingType?.exercises || []);
    const [newExercise, setNewExercise] = useState('');

    const handleAddExercise = () => {
        if (newExercise.trim()) {
            setExercises([...exercises, newExercise.trim()]);
            setNewExercise('');
        }
    };

    const handleRemoveExercise = (index) => {
        setExercises(exercises.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!name.trim()) {
            alert('Please enter a workout type name');
            return;
        }

        const customType = {
            id: editingType?.id || `custom_${Date.now()}`,
            label: name.trim(),
            color: selectedColor,
            border: selectedColor.replace('bg-', 'border-'),
            exercises: exercises,
            isCustom: true,
        };

        onSave(customType);
        onClose();
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
                            {editingType ? 'Edit' : 'Create'} Custom Workout Type
                        </h2>
                        <p className="text-sm text-text-muted">Define your own workout category</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-muted">
                            Workout Type Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Yoga, HIIT, Swimming..."
                            className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-sm text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        />
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-3">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-muted flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            Calendar Color
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                            {COLOR_OPTIONS.map((color) => (
                                <button
                                    key={color.class}
                                    onClick={() => setSelectedColor(color.class)}
                                    className={`h-12 rounded-lg transition-all ${color.class} ${selectedColor === color.class
                                            ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110'
                                            : 'hover:scale-105'
                                        }`}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Exercise List */}
                    <div className="space-y-3">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-muted">
                            Default Exercises (Optional)
                        </label>

                        {/* Add Exercise Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newExercise}
                                onChange={(e) => setNewExercise(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddExercise()}
                                placeholder="Add exercise..."
                                className="flex-1 px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            />
                            <button
                                onClick={handleAddExercise}
                                disabled={!newExercise.trim()}
                                className="px-4 py-2 bg-primary hover:bg-primary/80 disabled:bg-surfaceHighlight disabled:text-text-muted disabled:cursor-not-allowed text-background rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                ADD
                            </button>
                        </div>

                        {/* Exercise List */}
                        {exercises.length > 0 && (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {exercises.map((exercise, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-background border border-white/10 rounded-lg"
                                    >
                                        <span className="text-sm text-white">{exercise}</span>
                                        <button
                                            onClick={() => handleRemoveExercise(index)}
                                            className="p-1 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-white/10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 sm:justify-between bg-surfaceHighlight/10">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 hover:bg-white/5 rounded-lg text-sm font-bold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-white text-black hover:bg-gray-200 rounded-lg text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-95"
                    >
                        {editingType ? 'UPDATE' : 'CREATE'} WORKOUT TYPE
                    </button>
                </div>
            </div>
        </div>
    );
}
