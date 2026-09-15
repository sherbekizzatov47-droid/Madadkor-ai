/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Manrope"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        base: {
          950: '#04070d',
          900: '#070c16',
          800: '#0c1424',
        },
        emerald: {
          glow: '#1be3b4',
        },
        violet: {
          glow: '#8b6bff',
        },
        amber: {
          glow: '#ffb454',
        },
      },
      boxShadow: {
        'glow-emerald': '0 0 20px 0 rgba(27,227,180,0.35), 0 0 60px 0 rgba(27,227,180,0.08)',
        'glow-violet': '0 0 20px 0 rgba(139,107,255,0.4), 0 0 70px 0 rgba(139,107,255,0.1)',
        'glow-red': '0 0 20px 0 rgba(255,70,90,0.5), 0 0 60px 0 rgba(255,70,90,0.15)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        'radial-fade':
          'radial-gradient(circle at 50% 0%, rgba(27,227,180,0.14), transparent 55%)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.2,0.6,0.35,1) infinite',
        float: 'float 6s ease-in-out infinite',
        scan: 'scan 3s linear infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}
