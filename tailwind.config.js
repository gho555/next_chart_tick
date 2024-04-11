/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        Lexend: [ "Lexend", "sans-serif"],
      },
      
      gridTemplateColumns: {
        '3f': 'repeat(3, 1fr)',
        '2f': 'repeat(2,1fr)',
        '1f': 'repeat(1,1fr)',
      },

    },
  },
  plugins: [],
}

