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

    const totalRevenues = filteredTransactions
        .filter(t => t.type === 'Revenue')
        .reduce((acc, t) => acc + t.value, 0);

    const totalExpense = filteredTransactions
        .filter(t => t.type === 'Expense')
        .reduce((acc, t) => acc + t.value, 0);

    const total = totalRevenues - totalExpense;

    return (
        <div className="min-h-screen">
            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
                <header className="flex justify-between items-center text-3xl py-5 pl-3 font-bold text-white bg-[rgb(15_76_117)] border-b-8 border-[rgb(50,130,184)]">
                    <h1>Dashboard de Finanças</h1>
                    <button onClick={toggleTheme} className="pr-3 p-4">
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
                    <div className="flex flex-col">
                        <TransactionForm
                            onAdd={addTransaction}
                            onUpdate={updateTransaction}
                            editingTransaction={editingTransaction}
                            onCancelEdit={() => setEditingTransaction(null)}
                        />

                        <div className="m-5 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-3">
                            <div className="p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                                <span className="font-semibold">Total Receitas:</span> R$ {totalRevenues.toFixed(2)}
                            </div>

                            <div className="p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
                                <span className="font-semibold">Total Despesas:</span> R$ {totalExpense.toFixed(2)}
                            </div>

                            <div className={`p-3 rounded font-bold ${total >= 0
                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                }`}>
                                <span className="font-semibold">Saldo:</span> R$ {total.toFixed(2)}
                            </div>
                        </div>
                    </div>

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