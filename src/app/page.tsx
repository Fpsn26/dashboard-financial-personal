"use client"

import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import useTransactions from "@/hooks/useTransactions";

export default function Page() {
    const { transaction, addTransaction, updateTransaction, deleteTransaction } = useTransactions();

    return (
        <div>
            <h1 className="text-3xl py-5 pl-3 font-bold text-white bg-[rgb(15_76_117)] border-b-8 border-[rgb(50,130,184)]">Dashboard de Finanças</h1>

            <div className="flex flex-2 flex-row">
                <TransactionForm onAdd={addTransaction} />

                <TransactionList
                    transaction={transaction}
                    onDelete={deleteTransaction}
                    onEdit={updateTransaction}
                />
            </div>
        </div>
    );
}