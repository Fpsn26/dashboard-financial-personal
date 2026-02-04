"use client"

import Filters from "@/components/transactions/Filters";
import PieChart from "@/components/transactions/PieChart";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import useTheme from "@/hooks/useTheme";
import useTransactions from "@/hooks/useTransactions";
import { FilterState, Transaction, TypeTransaction } from "@/types";
import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Sun, Moon, LayoutList, PieChart as PieChartIcon } from 'lucide-react';

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

    return (
        <div className="min-h-screen bg-[rgb(27,38,44)] overflow-x-hidden">
            <header className="bg-[rgb(27,38,44)]/80 backdrop-blur-md border-b border-[rgb(50,130,184)]/30 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left min-w-0">
                        <h1 className="text-xl md:text-2xl font-bold text-[rgb(187,225,250)] truncate">Financial Dashboard</h1>
                        <p className="text-[rgb(187,225,250)]/60 text-xs">Controle suas finanças com clareza</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 px-4 py-2 bg-[rgb(15,76,117)] border border-[rgb(50,130,184)]/50 text-[rgb(187,225,250)] rounded-lg hover:bg-[rgb(50,130,184)]/20 transition-all shrink-0"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        <span className="hidden sm:inline">{theme === 'dark' ? 'Modo Light' : 'Modo Dark'}</span>
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 space-y-6 order-2 lg:order-1 min-w-0">
                        <TransactionForm
                            onAdd={addTransaction}
                            onUpdate={updateTransaction}
                            editingTransaction={editingTransaction}
                            onCancelEdit={() => setEditingTransaction(null)}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                            <div className="bg-linear-to-br from-emerald-500/20 to-emerald-600/5 backdrop-blur-sm rounded-xl p-5 border border-emerald-400/20">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-emerald-300/60 text-[10px] uppercase font-bold tracking-wider">Receitas</p>
                                        <p className="text-xl font-bold text-emerald-300 truncate">R$ {totalRevenues.toFixed(2)}</p>
                                    </div>
                                    <TrendingUp size={20} className="text-emerald-400 shrink-0" />
                                </div>
                            </div>

                            <div className="bg-linear-to-br from-red-500/20 to-red-600/5 backdrop-blur-sm rounded-xl p-5 border border-red-400/20">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-red-300/60 text-[10px] uppercase font-bold tracking-wider">Despesas</p>
                                        <p className="text-xl font-bold text-red-300 truncate">R$ {totalExpense.toFixed(2)}</p>
                                    </div>
                                    <TrendingDown size={20} className="text-red-400 shrink-0" />
                                </div>
                            </div>

                            <div className={`sm:col-span-2 lg:col-span-1 p-5 rounded-xl border backdrop-blur-sm ${total >= 0 ? 'bg-blue-500/10 border-blue-400/20' : 'bg-red-500/10 border-red-400/20'}`}>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className={`${total >= 0 ? 'text-blue-300/60' : 'text-red-300/60'} text-[10px] uppercase font-bold tracking-wider`}>Saldo Total</p>
                                        <p className={`text-2xl font-black ${total >= 0 ? 'text-blue-300' : 'text-red-300'} truncate`}>R$ {total.toFixed(2)}</p>
                                    </div>
                                    <DollarSign size={24} className={total >= 0 ? 'text-blue-400' : 'text-red-400'} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 order-1 lg:order-2 min-w-0">
                        <div className="glass-card flex flex-col min-h-125 overflow-hidden">
                            <div className="p-4 border-b border-[rgb(50,130,184)]/20 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[rgb(15,76,117)]/20">
                                <div className="flex gap-1 p-1 bg-[rgb(27,38,44)]/60 rounded-xl border border-[rgb(50,130,184)]/20 w-full sm:w-auto shrink-0">
                                    <button
                                        onClick={() => setView('list')}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${view === 'list' ? 'bg-[rgb(50,130,184)] text-white' : 'text-[rgb(187,225,250)]/50'}`}
                                    >
                                        <LayoutList size={16} />
                                        <span>Lista</span>
                                    </button>
                                    <button
                                        onClick={() => setView('chart')}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${view === 'chart' ? 'bg-[rgb(50,130,184)] text-white' : 'text-[rgb(187,225,250)]/50'}`}
                                    >
                                        <PieChartIcon size={16} />
                                        <span>Gráfico</span>
                                    </button>
                                </div>
                                <div className="w-full sm:w-auto min-w-0">
                                    <Filters onFilterChange={setActiveFilters} />
                                </div>
                            </div>

                            <div className="flex-1 p-4 md:p-6 overflow-y-auto max-h-150 scrollbar-thin scrollbar-thumb-[rgb(50,130,184)]/20">
                                {view === 'list' ? (
                                    <TransactionList transaction={filteredTransactions} onDelete={deleteTransaction} onEdit={updateTransaction} onStartEdit={setEditingTransaction} />
                                ) : (
                                    <PieChart transaction={filteredTransactions} type={chartType} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}