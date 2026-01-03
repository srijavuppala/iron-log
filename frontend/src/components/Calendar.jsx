import React from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isToday,
    isSameDay
} from 'date-fns';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WORKOUT_COLORS = {
    Push: 'bg-push',
    Pull: 'bg-pull',
    Legs: 'bg-legs',
    Core: 'bg-core',
    Cardio: 'bg-cardio',
    Running: 'bg-cardio',
};

export default function Calendar({ currentDate, onDateChange, workouts, onDayClick }) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const nextMonth = () => onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    const prevMonth = () => onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={prevMonth} className="p-2 hover:bg-surfaceHighlight rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-heading font-bold uppercase tracking-widest">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-surfaceHighlight rounded-full transition-colors">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            <div className="grid grid-cols-7 gap-px bg-white/5 rounded-lg overflow-hidden border border-white/10">
                {days.map((day, dayIdx) => {
                    const dayWorkouts = workouts.filter(w => isSameDay(new Date(w.date), day));

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => onDayClick(day)}
                            className={cn(
                                "min-h-[100px] bg-background p-2 cursor-pointer transition-colors hover:bg-surface/50 relative group",
                                !isSameMonth(day, monthStart) && "text-text-muted/20 bg-background/50",
                                isToday(day) && "bg-surfaceHighlight/30"
                            )}
                        >
                            <div className={cn(
                                "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1 mx-auto",
                                isToday(day) ? "bg-primary text-background font-bold" : "text-text-muted"
                            )}>
                                {format(day, 'd')}
                            </div>

                            {/* Workout Dots/Labels */}
                            <div className="flex flex-col gap-1 mt-1">
                                {dayWorkouts.map((workout, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "text-[10px] px-1.5 py-0.5 rounded-full truncate font-medium text-background",
                                            WORKOUT_COLORS[workout.type] || 'bg-surfaceHighlight text-white'
                                        )}
                                    >
                                        {workout.type}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
                {Object.entries(WORKOUT_COLORS).map(([type, colorClass]) => (
                    <div key={type} className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", colorClass)} />
                        <span className="text-xs text-text-muted uppercase tracking-wider">{type}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
