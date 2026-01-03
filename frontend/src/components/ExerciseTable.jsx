import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ExerciseTable({ exercises, onChange, onRemove }) {
    const handleVerify = (idx, field, value) => {
        // Basic validation or just update
        const newExercises = [...exercises];
        newExercises[idx] = { ...newExercises[idx], [field]: value };
        onChange(newExercises);
    };

    return (
        <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-surface/50">
            <div className="grid grid-cols-[3fr,1fr,1fr,1fr,auto] gap-2 p-3 bg-white/5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                <div>Exercise</div>
                <div className="text-center">Reps</div>
                <div className="text-center">Sets</div>
                <div className="text-center">Weight</div>
                <div className="w-8"></div>
            </div>

            <div className="max-h-[300px] overflow-y-auto">
                {exercises.map((ex, idx) => (
                    <div key={idx} className="grid grid-cols-[3fr,1fr,1fr,1fr,auto] gap-2 p-3 border-t border-white/5 items-center hover:bg-white/5 transition-colors">
                        <div className="font-medium truncate text-sm">{ex.name}</div>

                        <input
                            type="text"
                            value={ex.reps || ''}
                            onChange={(e) => handleVerify(idx, 'reps', e.target.value)}
                            placeholder="12"
                            className="w-full bg-transparent text-center border-b border-white/10 focus:border-primary outline-none transition-colors text-sm"
                        />

                        <input
                            type="number"
                            value={ex.sets || 3}
                            onChange={(e) => handleVerify(idx, 'sets', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent text-center border-b border-white/10 focus:border-primary outline-none transition-colors text-sm"
                        />

                        <input
                            type="number"
                            value={ex.weight || ''}
                            onChange={(e) => handleVerify(idx, 'weight', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full bg-transparent text-center border-b border-white/10 focus:border-primary outline-none transition-colors text-sm"
                        />

                        <button
                            onClick={() => onRemove(idx)}
                            className="p-1 hover:text-red-400 text-text-muted transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {exercises.length === 0 && (
                    <div className="p-8 text-center text-text-muted text-sm italic">
                        No exercises added yet. Select from above to add.
                    </div>
                )}
            </div>
        </div>
    );
}
