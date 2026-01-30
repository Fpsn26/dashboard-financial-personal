"use client"

import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import useTransactions from "@/hooks/useTransactions";
import { Transaction } from "@/types";
import { useState, useEffect } from "react";

export default function Page() {
    const { transaction, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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
                    transaction={transaction}
                    onDelete={deleteTransaction}
                    onEdit={updateTransaction}
                    onStartEdit={setEditingTransaction}
                />
            </div>
        </div>
    );
}