/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ['Outfit', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            colors: {
                // Vibe Palette: Dark, Sleek, Neon accents
                background: '#09090b', // Zinc 950
                surface: '#18181b',    // Zinc 900
                surfaceHighlight: '#27272a', // Zinc 800
                primary: '#f472b6',    // Pink 400 (Vibrant for actions)
                secondary: '#a78bfa',  // Violet 400
                accent: '#2dd4bf',     // Teal 400
                text: {
                    main: '#fafafa',     // Zinc 50
                    muted: '#a1a1aa',    // Zinc 400
                },
                // Workout specific colors
                push: '#f87171', // Red
                pull: '#60a5fa', // Blue
                legs: '#4ade80', // Green
                core: '#fbbf24', // Amber
                cardio: '#f472b6', // Pink
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
