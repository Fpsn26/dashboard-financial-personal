"use client"
import { expense, FilterState, revenue } from "@/types";
import { useState, useRef, useEffect } from "react";
import { Filter, X, RotateCcw, Check } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import CustomSelect from "../CustomSelect";

interface FiltersProps {
    onFilterChange: (filters: FilterState) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [type, setType] = useState<'all' | 'Revenue' | 'Expense'>('all');
    const [category, setCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleApplyFilter = () => {
        onFilterChange({ type, category, startDate, endDate });
        setDropdown(false);
    }

    const handleClearFilter = () => {
        setType('all'); setCategory(''); setStartDate(''); setEndDate('');
        onFilterChange({ type: 'all', category: '', startDate: '', endDate: '' });
    }

    const categoriesToShow = type === 'Revenue' ? revenue : type === 'Expense' ? expense : [...new Set([...revenue, ...expense])];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdown(false);
            }
        }

        if (dropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdown]);

    return (
        <div ref={dropdownRef} className="relative w-full sm:w-auto">
            <button
                onClick={() => setDropdown(!dropdown)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${dropdown
                    ? isDark ? 'bg-[rgb(50,130,184)] text-white border-[rgb(50,130,184)]' : 'bg-blue-600 text-white border-blue-600'
                    : isDark ? 'bg-[rgb(15,76,117)]/30 text-[rgb(187,225,250)] border-[rgb(50,130,184)]/30 hover:bg-[rgb(50,130,184)]/20' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
            >
                {dropdown ? <X size={16} /> : <Filter size={16} />}
                <span className="text-xs font-bold uppercase tracking-wider">{dropdown ? 'Fechar' : 'Filtros'}</span>
            </button>

            {dropdown && (
                <div className="fixed inset-x-2 top-20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-80 mt-12 max-w-sm z-50 glass-card p-2 sm:p-4 shadow-2xl animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-0.5">
                            <label className={`text-[10px] font-bold uppercase ml-1 ${isDark ? 'text-[rgb(187,225,250)]/40' : 'text-gray-600'}`}>Tipo</label>
                            <CustomSelect
                                value={type}
                                onChange={(value) => setType(value as any)}
                                options={[
                                    { value: 'all', label: 'Todos' },
                                    { value: 'Revenue', label: 'Receitas' },
                                    { value: 'Expense', label: 'Despesas' }
                                ]}
                                placeholder="Tipo"
                                className="text-xs"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className={`text-[10px] font-bold uppercase ml-1 ${isDark ? 'text-[rgb(187,225,250)]/40' : 'text-gray-600'}`}>Categoria</label>
                            <CustomSelect
                                value={category}
                                onChange={(value) => setCategory(value)}
                                options={[
                                    { value: '', label: 'Todas' },
                                    ...categoriesToShow.map(cat => ({ value: cat, label: cat }))
                                ]}
                                placeholder="Categoria"
                                className="text-xs"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className={`text-[10px] font-bold uppercase ml-1 ${isDark ? 'text-[rgb(187,225,250)]/40' : 'text-gray-600'}`}>Data de Início</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-styled py-2 text-xs" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className={`text-[10px] font-bold uppercase ml-1 ${isDark ? 'text-[rgb(187,225,250)]/40' : 'text-gray-600'}`}>Data de Fim</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-styled py-2 text-xs" />
                        </div>
                    </div>
                    <div className={`flex flex-col sm:flex-row gap-2 mt-3 pt-2 border-t ${isDark ? 'border-[rgb(50,130,184)]/20' : 'border-gray-200'}`}>
                        <button onClick={handleClearFilter} className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold uppercase ${isDark ? 'text-[rgb(187,225,250)]/50 hover:text-[rgb(187,225,250)]/80' : 'text-gray-600 hover:text-gray-800'}`}>
                            <RotateCcw size={12} /> Resetar
                        </button>
                        <button onClick={handleApplyFilter} className={`flex-2 flex items-center justify-center gap-2 py-2 text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg ${isDark ? 'bg-[rgb(50,130,184)] text-white hover:bg-[rgb(50,130,184)]/90' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                            <Check size={14} /> Aplicar
                        </button>
                    </div>
                </div>
            )
            }
        </div >
    );
}