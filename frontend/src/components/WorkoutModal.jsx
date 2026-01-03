import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Copy, Trash } from 'lucide-react';
import { getWorkoutTypes, getExercisesForType, saveCustomWorkoutType } from '../lib/constants';
import ExerciseTable from './ExerciseTable';
import CustomTypeModal from './CustomTypeModal';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function WorkoutModal({ date, existingWorkout, onClose, onSave, onDelete, onShare }) {
    const [data, setData] = useState({
        type: 'Push',
        exercises: [],
        weight_unit: 'lbs' // Default
    });
    const [customExercise, setCustomExercise] = useState('');
    const [showCustomTypeModal, setShowCustomTypeModal] = useState(false);
    const [workoutTypes, setWorkoutTypes] = useState(getWorkoutTypes());

    useEffect(() => {
        if (existingWorkout) {
            setData(existingWorkout);
        } else {
            // Reset if new
            setData(prev => ({ ...prev, exercises: [] }));
        }
    }, [existingWorkout]);

    const handleTypeChange = (type) => {
        setData(prev => ({ ...prev, type }));
    };

    const addExercise = (name) => {
        setData(prev => ({
            ...prev,
            exercises: [...prev.exercises, { name, reps: '12', sets: 3, weight: 0 }]
        }));
    };

    const addCustomExercise = () => {
        if (customExercise.trim()) {
            addExercise(customExercise.trim());
            setCustomExercise('');
        }
    };

    const handleExerciseChange = (newExercises) => {
        setData(prev => ({ ...prev, exercises: newExercises }));
    };

    const handleExerciseRemove = (idx) => {
        const newEx = [...data.exercises];
        newEx.splice(idx, 1);
        setData(prev => ({ ...prev, exercises: newEx }));
    };

    const handleCustomTypeSave = (customType) => {
        saveCustomWorkoutType(customType);
        setWorkoutTypes(getWorkoutTypes());
        setData(prev => ({ ...prev, type: customType.id }));
    };

    const availableExercises = getExercisesForType(data.type);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="w-full max-w-2xl bg-surface border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-surfaceHighlight/20">
                    <div>
                        <h2 className="text-xl font-heading font-bold uppercase tracking-wider text-white">
                            {format(new Date(date), 'EEEE, MMMM d')}
                        </h2>
                        <p className="text-sm text-text-muted">Log your training</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
                    {/* Type Selector */}
                    <div className="space-y-3">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-muted">Workout Type</label>
                        <div className="flex flex-wrap gap-2">
                            {workoutTypes.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => handleTypeChange(t.id)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-bold transition-all border border-transparent",
                                        data.type === t.id
                                            ? `bg-surface text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] ring-1 ring-white/50`
                                            : "bg-surfaceHighlight hover:bg-surfaceHighlight/80 text-text-muted"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-2 h-2 rounded-full", t.color)} />
                                        {t.label}
                                    </div>
                                </button>
                            ))}
                            <button
                                onClick={() => setShowCustomTypeModal(true)}
                                className="px-4 py-2 rounded-lg text-sm font-bold transition-all border border-dashed border-white/20 bg-surfaceHighlight/50 hover:bg-surfaceHighlight text-text-muted hover:text-white"
                            >
                                <div className="flex items-center gap-2">
                                    <Plus className="w-3 h-3" />
                                    Custom Type
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Weight Unit Toggle */}
                    <div className="flex items-center justify-between">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-muted">Weight Unit</label>
                        <div className="flex bg-surfaceHighlight rounded-lg p-1">
                            {['lbs', 'kg'].map(unit => (
                                <button
                                    key={unit}
                                    onClick={() => setData(prev => ({ ...prev, weight_unit: unit }))}
                                    className={cn(
                                        "px-3 py-1 text-xs font-bold rounded-md transition-all",
                                        data.weight_unit === unit ? "bg-primary text-background shadow-sm" : "text-text-muted hover:text-white"
                                    )}
                                >
                                    {unit.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Add Exercise */}
                    <div className="space-y-3">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-muted">Quick Add Exercise</label>
                        <div className="flex lg:flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {availableExercises.map(ex => (
                                <button
                                    key={ex}
                                    onClick={() => addExercise(ex)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-surfaceHighlight/50 hover:bg-surfaceHighlight border border-white/5 rounded-md text-xs whitespace-nowrap transition-colors"
                                >
                                    <Plus className="w-3 h-3 text-primary" />
                                    {ex}
                                </button>
                            ))}
                        </div>

                        {/* Custom Exercise Input */}
                        <div className="flex gap-2 mt-3">
                            <input
                                type="text"
                                value={customExercise}
                                onChange={(e) => setCustomExercise(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addCustomExercise()}
                                placeholder="Type custom exercise name..."
                                className="flex-1 px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            />
                            <button
                                onClick={addCustomExercise}
                                disabled={!customExercise.trim()}
                                className="px-4 py-2 bg-primary hover:bg-primary/80 disabled:bg-surfaceHighlight disabled:text-text-muted disabled:cursor-not-allowed text-background rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                ADD
                            </button>
                        </div>
                    </div>

                    {/* Exercise Table */}
                    <div className="space-y-3">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-muted">Log</label>
                        <ExerciseTable
                            exercises={data.exercises}
                            onChange={handleExerciseChange}
                            onRemove={handleExerciseRemove}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 sm:justify-between bg-surfaceHighlight/10">
                    <div className="flex items-center gap-2">
                        {existingWorkout && (
                            <button
                                onClick={() => onDelete(existingWorkout.id)}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                            >
                                <Trash className="w-4 h-4" />
                                DELETE
                            </button>
                        )}
                        <button
                            onClick={() => onShare({ ...data, date })}
                            className="px-4 py-2 bg-surfaceHighlight hover:bg-surface border border-white/10 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                            <Copy className="w-4 h-4" />
                            SHARE
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="px-6 py-2 hover:bg-white/5 rounded-lg text-sm font-bold transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave({ ...data, date })}
                            className="px-6 py-2 bg-white text-black hover:bg-gray-200 rounded-lg text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-95"
                        >
                            <Save className="w-4 h-4" />
                            SAVE WORKOUT
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Type Modal */}
            {showCustomTypeModal && (
                <CustomTypeModal
                    onClose={() => setShowCustomTypeModal(false)}
                    onSave={handleCustomTypeSave}
                />
            )}
        </div>
    );
}
