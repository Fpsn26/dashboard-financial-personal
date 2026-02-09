"use client"

import { useTheme } from "@/components/theme/ThemeProvider";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = "Selecione...",
    disabled = false,
    error = false,
    className = ""
}: CustomSelectProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption?.label || placeholder;

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`input-styled w-full flex items-center justify-between gap-2 ${error ? 'border-red-500 border-2' : ''
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <span className={!selectedOption ? (isDark ? 'text-[rgb(187,225,250)]/40' : 'text-gray-400') : ''}>
                    {displayText}
                </span>
                <ChevronDown
                    size={16}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-[rgb(187,225,250)]/60' : 'text-gray-600'
                        }`}
                />
            </button>

            {isOpen && (
                <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-50 overflow-hidden ${isDark
                    ? 'bg-[rgb(15,76,117)] border-[rgb(50,130,184)]/40'
                    : 'bg-white border-gray-300'
                    }`}>
                    <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-[rgb(50,130,184)]/20">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === option.value
                                    ? isDark
                                        ? 'bg-[rgb(50,130,184)] text-white font-medium'
                                        : 'bg-blue-100 text-blue-900 font-medium'
                                    : isDark
                                        ? 'text-[rgb(187,225,250)] hover:bg-[rgb(50,130,184)]/20'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}