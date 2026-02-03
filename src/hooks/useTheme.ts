import { useEffect, useState } from "react";

export default function useTheme() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const saved = localStorage.getItem('theme');

        if (saved) {
            setTheme(saved as 'light' | 'dark');
        } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(systemPrefersDark ? 'dark' : 'light');
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        console.log('Tema atual:', theme);
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        console.log('Novo tema:', newTheme);
        setTheme(newTheme);
    }

    return { theme, toggleTheme };
}