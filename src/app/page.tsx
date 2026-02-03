"use client"

import Filters from "@/components/transactions/Filters";
import PieChart from "@/components/transactions/PieChart";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import useTheme from "@/hooks/useTheme";
import useTransactions from "@/hooks/useTransactions";
import { FilterState, Transaction, TypeTransaction } from "@/types";
import { useState } from "react";

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
        if (activeFilters.type !== 'all' && t.type !== (activeFilters.type as TypeTransaction)) {
            return false;
        }

        if (activeFilters.category && t.category !== activeFilters.category) {
            return false;
        }

        if (activeFilters.startDate && new Date(t.date) < new Date(activeFilters.startDate)) {
            return false;
        }

        if (activeFilters.endDate && new Date(t.date) > new Date(activeFilters.endDate)) {
            return false;
        }

        return true;
    })

    return (
        <div className="min-h-screen">
            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
                <header className="flex justify-between items-center text-3xl py-5 pl-3 font-bold text-white bg-[rgb(15_76_117)] border-b-8 border-[rgb(50,130,184)]">
                    <h1>Dashboard de Finanças</h1>
                    <button onClick={toggleTheme} className="pr-3 p-4 dark:bg-yellow-500">
                        {theme === 'dark' ? 'Light' : 'Dark'}
                    </button>
                </header>

                <div>
                    <input
                        type="radio"
                        name="view"
                        value="list"
                        checked={view === 'list'}
                        onChange={() => setView('list')}
                    /> <label>Lista</label>

                    <input
                        type="radio"
                        name="view"
                        value="chart"
                        checked={view === 'chart'}
                        onChange={() => setView('chart')}
                    /> <label>Gráfico</label>


                    {view === 'chart' && (
                        <div>
                            <input
                                type="radio"
                                name="chartType"
                                value="all"
                                checked={chartType === 'all'}
                                onChange={() => setChartType('all')}
                            /> <label>Todas</label>
                            <input
                                type="radio"
                                name="chartType"
                                value="Revenue"
                                checked={chartType === 'Revenue'}
                                onChange={() => setChartType('Revenue')}
                            /> <label>Receitas</label>
                            <input
                                type="radio"
                                name="chartType"
                                value="Expense"
                                checked={chartType === 'Expense'}
                                onChange={() => setChartType('Expense')}
                            /> <label>Despesas</label>
                        </div>
                    )}
                </div>

                <div className="flex flex-2 flex-row">
                    <TransactionForm
                        onAdd={addTransaction}
                        onUpdate={updateTransaction}
                        editingTransaction={editingTransaction}
                        onCancelEdit={() => setEditingTransaction(null)}
                    />

                    {view === 'list' ? (
                        <>
                            <TransactionList
                                transaction={filteredTransactions}
                                onDelete={deleteTransaction}
                                onEdit={updateTransaction}
                                onStartEdit={setEditingTransaction}
                            />

                            <Filters
                                onFilterChange={setActiveFilters}
                            />
                        </>
                    ) : (
                        <PieChart transaction={filteredTransactions} type={chartType} />
                    )}
                </div>
            </div>
        </div>
    );
}