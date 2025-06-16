/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-gray-50',
    'px-4',
    'py-2',
    'rounded-md',
    'font-medium',
    'transition-colors',
    'bg-blue-600',
    'text-white',
    'hover:bg-blue-700',
    'bg-red-600',
    'hover:bg-red-700',
    'w-full',
    'px-3',
    'py-2',
    'border',
    'border-gray-300',
    'rounded-md',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'mb-4',
    'block',
    'text-sm',
    'font-medium',
    'text-gray-700',
    'mb-1',
    'text-red-600',
    'text-sm',
    'mt-1'
  ]
} 