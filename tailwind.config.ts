import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    900: 'rgb(27,38,44)',
                    800: 'rgb(15,76,117)',
                    600: 'rgb(50,130,184)',
                    400: 'rgb(100,170,210)',
                    200: 'rgb(187,225,250)',
                    100: 'rgb(220,240,255)',
                },
                accent: {
                    success: 'rgb(16,185,129)',
                    danger: 'rgb(239,68,68)',
                    warning: 'rgb(245,158,11)',
                    info: 'rgb(59,130,246)',
                },
            },
        },
    },
    plugins: [],
} satisfies Config;