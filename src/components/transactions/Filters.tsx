"use client"
import { expense, FilterState, revenue } from "@/types";
import { useState } from "react";
import { Filter, X, RotateCcw, Check } from "lucide-react";

interface FiltersProps {
    onFilterChange: (filters: FilterState) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
    const [type, setType] = useState<'all' | 'Revenue' | 'Expense'>('all');
    const [category, setCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dropdown, setDropdown] = useState(false);

    const handleApplyFilter = () => {
        onFilterChange({ type, category, startDate, endDate });
        if (window.innerWidth < 1024) setDropdown(false);
    }

    const handleClearFilter = () => {
        setType('all'); setCategory(''); setStartDate(''); setEndDate('');
        onFilterChange({ type: 'all', category: '', startDate: '', endDate: '' });
    }

    const categoriesToShow = type === 'Revenue' ? revenue : type === 'Expense' ? expense : [...new Set([...revenue, ...expense])];

    return (
        <div className="relative w-full sm:w-auto">
            <button
                onClick={() => setDropdown(!dropdown)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${dropdown
                    ? 'bg-[rgb(50,130,184)] text-white border-[rgb(50,130,184)]'
                    : 'bg-[rgb(15,76,117)]/30 text-[rgb(187,225,250)] border-[rgb(50,130,184)]/30 hover:bg-[rgb(50,130,184)]/20'
                    }`}
            >
                {dropdown ? <X size={16} /> : <Filter size={16} />}
                <span className="text-xs font-bold uppercase tracking-wider">{dropdown ? 'Fechar' : 'Filtros'}</span>
            </button>

            {dropdown && (
                <div className="absolute right-0 top-full mt-4 w-screen max-w-[calc(100vw-2rem)] sm:w-100 z-50 glass-card p-4 sm:p-6 shadow-2xl animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-[rgb(187,225,250)]/40 uppercase ml-1">Tipo</label>
                            <select value={type} onChange={(e) => setType(e.target.value as any)} className="input-styled py-2 text-xs">
                                <option value="all">Todos</option>
                                <option value="Revenue">Receitas</option>
                                <option value="Expense">Despesas</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-[rgb(187,225,250)]/40 uppercase ml-1">Categoria</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-styled py-2 text-xs">
                                <option value="">Todas</option>
                                {categoriesToShow.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-[rgb(187,225,250)]/40 uppercase ml-1">Início</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-styled py-2 text-xs" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-[rgb(187,225,250)]/40 uppercase ml-1">Fim</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-styled py-2 text-xs" />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-[rgb(50,130,184)]/20">
                        <button onClick={handleClearFilter} className="flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-[rgb(187,225,250)]/50 uppercase">
                            <RotateCcw size={12} /> Resetar
                        </button>
                        <button onClick={handleApplyFilter} className="flex-2 flex items-center justify-center gap-2 py-2.5 bg-[rgb(50,130,184)] text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg">
                            <Check size={14} /> Aplicar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}