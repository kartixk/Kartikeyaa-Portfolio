import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // adaptive hairline / surface tint — bone in dark, ink in light
        line: "rgb(var(--line) / <alpha-value>)",
        orange: "hsl(var(--c-orange))",
        pink: "hsl(var(--c-pink))",
        violet: "hsl(var(--c-violet))",
        cyan: "hsl(var(--c-cyan))",
        lime: "hsl(var(--c-lime))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(var(--r, 0deg))" },
          "50%": { transform: "translateY(-10px) rotate(var(--r, 0deg))" },
        },
        ripple: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "scale(1.15)", opacity: "0" },
        },
        blink: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.25" } },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(6vw,-5vh,0) scale(1.12)" },
          "66%": { transform: "translate3d(-5vw,6vh,0) scale(0.94)" },
        },
        wobble: {
          "0%, 100%": { transform: "rotate(var(--r, 0deg)) translateY(0)" },
          "50%": { transform: "rotate(calc(var(--r, 0deg) + 3deg)) translateY(-8px)" },
        },
        "eye-blink": {
          "0%, 93%, 100%": { transform: "scaleY(1)" },
          "96%": { transform: "scaleY(0.08)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "marquee-reverse": "marquee-reverse 32s linear infinite",
        "spin-slow": "spin-slow 16s linear infinite",
        float: "float 6s ease-in-out infinite",
        ripple: "ripple 3.2s ease-out infinite",
        blink: "blink 1.6s ease-in-out infinite",
        drift: "drift 22s ease-in-out infinite",
        wobble: "wobble 5s ease-in-out infinite",
        "eye-blink": "eye-blink 6.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
