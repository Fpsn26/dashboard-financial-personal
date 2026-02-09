"use client"

import Filters from "@/components/transactions/Filters";
import PieChart from "@/components/transactions/PieChart";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import { useTheme } from "@/components/theme/ThemeProvider";
import useTransactions from "@/hooks/useTransactions";
import { FilterState, Transaction, TypeTransaction } from "@/types";
import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Sun, Moon, LayoutList, PieChart as PieChartIcon } from 'lucide-react';
import ChangelogModal from "@/components/modal/ChangelogModal";

export default function Page() {
    const { transaction, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
    const { theme, toggleTheme } = useTheme();
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [activeFilters, setActiveFilters] = useState<FilterState>({
        type: 'all',
        category: '',
        startDate: '',
        endDate: ''
    });
    const [view, setView] = useState<'list' | 'chart'>('list');
    const [chartType, setChartType] = useState<TypeTransaction | 'all'>('all');

    const filteredTransactions = transaction.filter(t => {
        if (activeFilters.type !== 'all' && t.type !== activeFilters.type) return false;
        if (activeFilters.category && t.category !== activeFilters.category) return false;
        if (activeFilters.startDate && new Date(t.date) < new Date(activeFilters.startDate)) return false;
        if (activeFilters.endDate && new Date(t.date) > new Date(activeFilters.endDate)) return false;
        return true;
    });

    const totalRevenues = filteredTransactions
        .filter(t => t.type === 'Revenue')
        .reduce((acc, t) => acc + t.value, 0);

    const totalExpense = filteredTransactions
        .filter(t => t.type === 'Expense')
        .reduce((acc, t) => acc + t.value, 0);

    const total = totalRevenues - totalExpense;

    const totalRevenuesFormatted = totalRevenues.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const totalExpenseFormatted = totalExpense.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const totalFormatted = total.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return (
        <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${theme === 'dark'
            ? 'bg-[rgb(27,38,44)]'
            : 'bg-gray-50'
            }`}>

            <ChangelogModal />

            <header className={`backdrop-blur-md border-b sticky top-0 z-40 transition-colors duration-300 ${theme === 'dark'
                ? 'bg-[rgb(27,38,44)]/80 border-[rgb(50,130,184)]/30'
                : 'bg-white/90 border-gray-200'
                }`}>
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left min-w-0">
                        <h1 className={`text-xl md:text-2xl font-bold truncate transition-colors ${theme === 'dark' ? 'text-[rgb(187,225,250)]' : 'text-gray-900'
                            }`}>Financial Dashboard</h1>
                        <p className={`text-xs transition-colors ${theme === 'dark' ? 'text-[rgb(187,225,250)]/60' : 'text-gray-600'
                            }`}>Controle suas finanças com clareza</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shrink-0 ${theme === 'dark'
                            ? 'bg-[rgb(15,76,117)] border border-[rgb(50,130,184)]/50 text-[rgb(187,225,250)] hover:bg-[rgb(50,130,184)]/20'
                            : 'bg-gray-200 border border-gray-300 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        <span className="hidden sm:inline">{theme === 'dark' ? 'Modo Light' : 'Modo Dark'}</span>
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
                    <div className="lg:col-span-4 space-y-6 order-2 lg:order-1 min-w-0">
                        <TransactionForm
                            onAdd={addTransaction}
                            onUpdate={updateTransaction}
                            editingTransaction={editingTransaction}
                            onCancelEdit={() => setEditingTransaction(null)}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                            <div className={`rounded-xl p-5 border transition-colors ${theme === 'dark'
                                ? 'bg-linear-to-br from-emerald-500/20 to-emerald-600/5 backdrop-blur-sm border-emerald-400/20'
                                : 'bg-emerald-50 border-emerald-200'
                                }`}>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className={`text-[10px] uppercase font-bold tracking-wider ${theme === 'dark' ? 'text-emerald-300/60' : 'text-emerald-700'
                                            }`}>Receitas</p>
                                        <p className={`text-xl font-bold truncate ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-800'
                                            }`}>R$ {totalRevenuesFormatted}</p>
                                    </div>
                                    <TrendingUp size={20} className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} />
                                </div>
                            </div>

                            <div className={`rounded-xl p-5 border transition-colors ${theme === 'dark'
                                ? 'bg-linear-to-br from-red-500/20 to-red-600/5 backdrop-blur-sm border-red-400/20'
                                : 'bg-red-50 border-red-200'
                                }`}>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className={`text-[10px] uppercase font-bold tracking-wider ${theme === 'dark' ? 'text-red-300/60' : 'text-red-700'
                                            }`}>Despesas</p>
                                        <p className={`text-xl font-bold truncate ${theme === 'dark' ? 'text-red-300' : 'text-red-800'
                                            }`}>R$ {totalExpenseFormatted}</p>
                                    </div>
                                    <TrendingDown size={20} className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />
                                </div>
                            </div>

                            <div className={`sm:col-span-2 lg:col-span-1 p-5 rounded-xl border transition-colors ${total >= 0
                                ? theme === 'dark'
                                    ? 'bg-blue-500/10 border-blue-400/20 backdrop-blur-sm'
                                    : 'bg-blue-50 border-blue-200'
                                : theme === 'dark'
                                    ? 'bg-red-500/10 border-red-400/20 backdrop-blur-sm'
                                    : 'bg-red-50 border-red-200'
                                }`}>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className={`text-[10px] uppercase font-bold tracking-wider ${total >= 0
                                            ? theme === 'dark' ? 'text-blue-300/60' : 'text-blue-700'
                                            : theme === 'dark' ? 'text-red-300/60' : 'text-red-700'
                                            }`}>Saldo Total</p>
                                        <p className={`text-2xl font-black truncate ${total >= 0
                                            ? theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                                            : theme === 'dark' ? 'text-red-300' : 'text-red-800'
                                            }`}>R$ {totalFormatted}</p>
                                    </div>
                                    <DollarSign size={24} className={
                                        total >= 0
                                            ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                            : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                    } />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 order-1 lg:order-2 min-w-0">
                        <div className={`flex flex-col h-175 max-h-127 rounded-xl border transition-colors ${theme === 'dark'
                            ? 'glass-card'
                            : 'bg-white border-gray-200'
                            }`}>
                            <div className={`p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center transition-colors ${theme === 'dark'
                                ? 'border-[rgb(50,130,184)]/20 bg-[rgb(15,76,117)]/20'
                                : 'border-gray-200 bg-gray-50'
                                }`}>
                                <div className={`flex gap-1 p-1 rounded-xl border w-full sm:w-auto shrink-0 ${theme === 'dark'
                                    ? 'bg-[rgb(27,38,44)]/60 border-[rgb(50,130,184)]/20'
                                    : 'bg-gray-100 border-gray-200'
                                    }`}>
                                    <button
                                        onClick={() => setView('list')}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${view === 'list'
                                            ? theme === 'dark'
                                                ? 'bg-[rgb(50,130,184)] text-white'
                                                : 'bg-blue-600 text-white'
                                            : theme === 'dark'
                                                ? 'text-[rgb(187,225,250)]/50 hover:bg-gray-700 hover:text-white'
                                                : 'text-gray-600 hover:bg-gray-300 hover:text-[rgb(13,26,99)]'
                                            }`}
                                    >
                                        <LayoutList size={16} />
                                        <span>Lista</span>
                                    </button>
                                    <button
                                        onClick={() => setView('chart')}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${view === 'chart'
                                            ? theme === 'dark'
                                                ? 'bg-[rgb(50,130,184)] text-white'
                                                : 'bg-blue-600 text-white'
                                            : theme === 'dark'
                                                ? 'text-[rgb(187,225,250)]/50 hover:bg-gray-700 hover:text-white'
                                                : 'text-gray-600 hover:bg-gray-300 hover:text-[rgb(13,26,99)]'
                                            }`}
                                    >
                                        <PieChartIcon size={16} />
                                        <span>Gráfico</span>
                                    </button>
                                </div>
                                <div className="w-full sm:w-auto min-w-0">
                                    <Filters onFilterChange={setActiveFilters} />
                                </div>
                            </div>

                            <div className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[rgb(50,130,184)]/20">
                                {view === 'list' ? (
                                    <TransactionList transaction={filteredTransactions} onDelete={deleteTransaction} onEdit={updateTransaction} onStartEdit={setEditingTransaction} />
                                ) : (
                                    <div className="pb-8 md:pb-12">
                                        <PieChart transaction={filteredTransactions} type={chartType} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}