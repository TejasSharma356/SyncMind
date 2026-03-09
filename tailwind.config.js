/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/renderer/index.html",
        "./src/renderer/src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#09090b', // dark gray/black
                surface: '#18181b', // slightly lighter for cards
                primary: '#3b82f6', // blue
                text: '#fafafa',
                muted: '#a1a1aa'
            }
        },
    },
    plugins: [],
}
