/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-tertiary": "#1000a9",
        "on-primary-fixed-variant": "#004395",
        "error": "#ffb4ab",
        "tertiary-container": "#8083ff",
        "outline-variant": "#424754",
        "on-tertiary-container": "#0d0096",
        "on-error-container": "#ffdad6",
        "on-tertiary-fixed-variant": "#2f2ebe",
        "surface-container-lowest": "#060e20",
        "inverse-on-surface": "#283044",
        "on-surface-variant": "#c2c6d6",
        "surface-variant": "#2d3449",
        "tertiary-fixed": "#e1e0ff",
        "on-error": "#690005",
        "primary-fixed-dim": "#adc6ff",
        "inverse-primary": "#005ac2",
        "on-secondary-container": "#003f38",
        "on-secondary-fixed-variant": "#005048",
        "on-secondary-fixed": "#00201c",
        "surface-container": "#171f33",
        "background": "#0b1326",
        "secondary-fixed-dim": "#4fdbc8",
        "outline": "#8c909f",
        "surface-container-highest": "#2d3449",
        "secondary-fixed": "#71f8e4",
        "on-secondary": "#003731",
        "primary-container": "#4d8eff",
        "primary": "#adc6ff",
        "on-primary-container": "#00285d",
        "surface-bright": "#31394d",
        "surface-dim": "#0b1326",
        "surface": "#0b1326",
        "on-surface": "#dae2fd",
        "surface-container-high": "#222a3d",
        "primary-fixed": "#d8e2ff",
        "surface-tint": "#adc6ff",
        "on-primary-fixed": "#001a42",
        "secondary": "#4fdbc8",
        "secondary-container": "#04b4a2",
        "surface-container-low": "#131b2e",
        "tertiary": "#c0c1ff",
        "on-tertiary-fixed": "#07006c",
        "inverse-surface": "#dae2fd",
        "error-container": "#93000a",
        "tertiary-fixed-dim": "#c0c1ff",
        "on-primary": "#002e6a",
        "on-background": "#dae2fd"
      },
      fontFamily: {
        "headline": ["Manrope"],
        "body": ["Inter"],
        "label": ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px -10px rgba(173, 198, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px -10px rgba(173, 198, 255, 0.6)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}
