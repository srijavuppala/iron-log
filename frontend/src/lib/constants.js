export const WORKOUT_TYPES = [
    { id: 'Push', label: 'Push', color: 'bg-push', border: 'border-push' },
    { id: 'Pull', label: 'Pull', color: 'bg-pull', border: 'border-pull' },
    { id: 'Legs', label: 'Legs', color: 'bg-legs', border: 'border-legs' },
    { id: 'Core', label: 'Core', color: 'bg-core', border: 'border-core' },
    { id: 'Cardio', label: 'Cardio', color: 'bg-cardio', border: 'border-cardio' },
];

export const EXERCISE_MAPPING = {
    Push: [
        "Stretching", "Pushups", "Dumbbell Chest Press (Center)", "Dumbbell Chest Press (Upper)",
        "Machine Cable Fly (Center)", "Machine Cable Fly (Lower)", "Dumbbell Shoulder Press",
        "Dumbbell Lateral Raises", "Dumbbell Tricep Kickback", "Cable Rope Tricep Extension"
    ],
    Pull: [
        "Stretching", "Doorway Rows", "Dumbbell Rows", "Lat Pulldown Machine",
        "Seated Rows", "Dumbbell Shrugs", "Dumbbell Curl", "Hammer Curl", "Cable Curl"
    ],
    Legs: [ // Mapping "Leg" to "Legs" for consistency
        "Stretching", "Situps / Squats", "Leg Extensions (Hamstrings, Calves)",
        "Forward Lunges", "Calf Raises", "Glute Bridge"
    ],
    Core: [
        "Plank", "Mountain Climbers", "DB V-Sit Hold", "Leg Raise Hold",
        "DB Side Bend (each side)", "Crunches"
    ],
    Cardio: [
        "Running", "Other Cardio"
    ]
};

// Get all workout types including custom ones from localStorage
export const getWorkoutTypes = () => {
    try {
        const customTypes = JSON.parse(localStorage.getItem('custom_workout_types') || '[]');
        return [...WORKOUT_TYPES, ...customTypes];
    } catch (e) {
        console.error('Failed to load custom workout types:', e);
        return WORKOUT_TYPES;
    }
};

// Get exercises for a workout type (including custom types)
export const getExercisesForType = (type) => {
    // Check default mapping first
    if (EXERCISE_MAPPING[type]) {
        return EXERCISE_MAPPING[type];
    }

    // Check custom types
    try {
        const customTypes = JSON.parse(localStorage.getItem('custom_workout_types') || '[]');
        const customType = customTypes.find(t => t.id === type);
        return customType?.exercises || [];
    } catch (e) {
        return [];
    }
};

// Save custom workout types to localStorage
export const saveCustomWorkoutType = (customType) => {
    try {
        const customTypes = JSON.parse(localStorage.getItem('custom_workout_types') || '[]');
        const existingIndex = customTypes.findIndex(t => t.id === customType.id);

        if (existingIndex >= 0) {
            // Update existing
            customTypes[existingIndex] = customType;
        } else {
            // Add new
            customTypes.push(customType);
        }

        localStorage.setItem('custom_workout_types', JSON.stringify(customTypes));
        return true;
    } catch (e) {
        console.error('Failed to save custom workout type:', e);
        return false;
    }
};

// Delete custom workout type
export const deleteCustomWorkoutType = (typeId) => {
    try {
        const customTypes = JSON.parse(localStorage.getItem('custom_workout_types') || '[]');
        const filtered = customTypes.filter(t => t.id !== typeId);
        localStorage.setItem('custom_workout_types', JSON.stringify(filtered));
        return true;
    } catch (e) {
        console.error('Failed to delete custom workout type:', e);
        return false;
    }
};
