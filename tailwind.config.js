/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#3B82F6',
        'navy-dark': '#1E293B',
        'ready-badge': '#10B981',
        'featured-badge': '#6B7280',
        'text-dark': '#1F2937',
        'text-gray': '#6B7280',
        'bg-light': '#F9FAFB',
        'bg-gray': '#F3F4F6',
        'border-gray': '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

