import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Calendar from '../components/Calendar';
import WorkoutModal from '../components/WorkoutModal';
import ShareModal from '../components/ShareModal';
import ClipboardHistory from '../components/ClipboardHistory';
import Toast from '../components/Toast';
import api from '../api';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
    const { logout, user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [workouts, setWorkouts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shareModal, setShareModal] = useState(null); // { date, workout }
    const [showClipboardHistory, setShowClipboardHistory] = useState(false);
    const [toast, setToast] = useState(null); // { message }

    useEffect(() => {
        fetchWorkouts();
    }, [currentDate]); // Should fetch range, but for MVP fetch all
    // Or filter locally if we fetch all. For "Emergent" vibe, fetch all is fine for MVP.
    // If we want scalable, we fetch range. Let's fetch all sorted desc from backend and filter locally for now.

    const fetchWorkouts = async () => {
        try {
            const res = await api.get('/workouts');
            setWorkouts(res.data);
        } catch (error) {
            console.error("Failed to fetch workouts", error);
        }
    };

    const handleDayClick = (day) => {
        setSelectedDate(day);
        setIsModalOpen(true); // Will implement modal next
        console.log("Clicked day:", day);
    };

    return (
        <div className="min-h-screen bg-background text-text-main">
            {/* Top Nav */}
            <nav className="border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-black">
                            IL
                        </div>
                        <span className="font-heading font-bold tracking-tight">IRONLOG</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-surfaceHighlight/50 rounded-full pl-2 pr-4 py-1">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} className="w-8 h-8 rounded-full" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-blue-500" />
                            )}
                            <span className="text-sm font-medium">{user.name}</span>
                        </div>
                        <button onClick={logout} className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-muted hover:text-red-400">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8">
                <Calendar
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                    workouts={workouts}
                    onDayClick={handleDayClick}
                />
            </main>

            {/* Workout Modal */}
            {isModalOpen && (
                <WorkoutModal
                    date={selectedDate}
                    existingWorkout={workouts.find(w => new Date(w.date).toDateString() === selectedDate?.toDateString())}
                    onClose={() => setIsModalOpen(false)}
                    onSave={async (workoutData) => {
                        try {
                            await api.post('/workouts', workoutData);
                            await fetchWorkouts();
                            setIsModalOpen(false);
                            setToast({ message: 'Workout saved successfully!' });
                        } catch (err) {
                            console.error("Failed to save", err);
                            setToast({ message: 'Failed to save workout' });
                        }
                    }}
                    onDelete={async (id) => {
                        if (confirm("Are you sure?")) {
                            try {
                                await api.delete(`/workouts/${id}`);
                                await fetchWorkouts();
                                setIsModalOpen(false);
                                setToast({ message: 'Workout deleted' });
                            } catch (err) {
                                console.error("Failed to delete", err);
                            }
                        }
                    }}
                    onShare={(workoutData) => {
                        setShareModal({ date: selectedDate, workout: workoutData });
                    }}
                />
            )}

            {/* Share Modal */}
            {shareModal && (
                <ShareModal
                    date={shareModal.date}
                    workout={shareModal.workout}
                    onClose={() => setShareModal(null)}
                    onCopied={(message) => setToast({ message })}
                    onShowHistory={() => {
                        setShareModal(null);
                        setShowClipboardHistory(true);
                    }}
                />
            )}

            {/* Clipboard History */}
            {showClipboardHistory && (
                <ClipboardHistory
                    onClose={() => setShowClipboardHistory(false)}
                    onSelect={(text) => {
                        navigator.clipboard.writeText(text);
                        setToast({ message: 'Copied from history!' });
                    }}
                />
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}
