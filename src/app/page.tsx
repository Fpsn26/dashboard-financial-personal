"use client"

import Filters from "@/components/transactions/Filters";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import useTransactions from "@/hooks/useTransactions";
import { FilterState, Transaction, TypeTransaction } from "@/types";
import { useState } from "react";

export default function Page() {
    const { transaction, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [activeFilters, setActiveFilters] = useState<FilterState>({
        type: 'all',
        category: '',
        startDate: '',
        endDate: ''
    })

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
        <div>
            <h1 className="text-3xl py-5 pl-3 font-bold text-white bg-[rgb(15_76_117)] border-b-8 border-[rgb(50,130,184)]">Dashboard de Finanças</h1>

            <div className="flex flex-2 flex-row">
                <TransactionForm
                    onAdd={addTransaction}
                    onUpdate={updateTransaction}
                    editingTransaction={editingTransaction}
                    onCancelEdit={() => setEditingTransaction(null)}
                />

                <TransactionList
                    transaction={filteredTransactions}
                    onDelete={deleteTransaction}
                    onEdit={updateTransaction}
                    onStartEdit={setEditingTransaction}
                />

                <Filters
                    onFilterChange={setActiveFilters}
                />
            </div>
        </div>
    );
}