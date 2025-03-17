
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				orange: {
					DEFAULT: '#FF5722',
					50: '#FFF0EB',
					100: '#FFE0D6',
					200: '#FFC0AD',
					300: '#FFA184',
					400: '#FF815A',
					500: '#FF5722',
					600: '#E64A17',
					700: '#C43C0F',
					800: '#A33008',
					900: '#822606',
				},
				violet: {
					DEFAULT: '#6200EA',
					50: '#F1E7FF',
					100: '#E2CFFF',
					200: '#C49EFF',
					300: '#A66DFF',
					400: '#873CFF',
					500: '#6200EA',
					600: '#5000BE',
					700: '#400096',
					800: '#30006F',
					900: '#200047',
				},
				green: {
					DEFAULT: '#00C853',
					50: '#E3FFF0',
					100: '#C7FFE0',
					200: '#8FFFC1',
					300: '#57FFA2',
					400: '#1FFF83',
					500: '#00C853',
					600: '#00A243',
					700: '#007C34',
					800: '#005724',
					900: '#003115',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				sans: ['Inter var', 'sans-serif'],
				display: ['Clash Display', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				"accordion-up": {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				"float": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" },
				},
				"pulse-soft": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.8" },
				},
				"scale-in": {
					"0%": { transform: "scale(0.95)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" },
				},
				"scale-out": {
					"0%": { transform: "scale(1)", opacity: "1" },
					"100%": { transform: "scale(0.95)", opacity: "0" },
				},
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"fade-out": {
					"0%": { opacity: "1", transform: "translateY(0)" },
					"100%": { opacity: "0", transform: "translateY(10px)" },
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" },
				},
				"slide-in-left": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" },
				},
				"slide-in-bottom": {
					"0%": { transform: "translateY(100%)" },
					"100%": { transform: "translateY(0)" },
				},
				"slide-in-top": {
					"0%": { transform: "translateY(-100%)" },
					"100%": { transform: "translateY(0)" },
				},
				"blur-in": {
					"0%": { filter: "blur(5px)", opacity: "0" },
					"100%": { filter: "blur(0)", opacity: "1" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"float": "float 6s ease-in-out infinite",
				"pulse-soft": "pulse-soft 3s ease-in-out infinite",
				"scale-in": "scale-in 0.2s ease-out",
				"scale-out": "scale-out 0.2s ease-out",
				"fade-in": "fade-in 0.3s ease-out",
				"fade-out": "fade-out 0.3s ease-out",
				"slide-in-right": "slide-in-right 0.3s ease-out",
				"slide-in-left": "slide-in-left 0.3s ease-out",
				"slide-in-bottom": "slide-in-bottom 0.3s ease-out",
				"slide-in-top": "slide-in-top 0.3s ease-out",
				"blur-in": "blur-in 0.3s ease-out",
				"enter": "fade-in 0.3s ease-out, scale-in 0.2s ease-out",
				"exit": "fade-out 0.3s ease-out, scale-out 0.2s ease-out",
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
				'card': '0 4px 28px 0 rgba(0, 0, 0, 0.05)',
				'hover': '0 8px 30px rgba(0, 0, 0, 0.07)',
			},
			backdropBlur: {
				'xs': '2px',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
