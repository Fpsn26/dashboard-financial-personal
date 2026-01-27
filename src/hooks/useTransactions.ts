import { Transaction } from "@/types";
import { useEffect, useState } from "react";

const STORAGE_KEY = 'finance-transactions'

export default function useTransactions() {
    const [transaction, setTransaction] = useState<Transaction[]>([]);

    useEffect(() => {
        try {
            const transactions = localStorage.getItem(STORAGE_KEY);
            if (transactions) {
                const json = JSON.parse(transactions)
                setTransaction(json);
            }
        } catch (error) {
            console.log("Erro ao carregar transações: ", error);
        }

    }, [])

    useEffect(() => {
        try {
            const json = JSON.stringify(transaction);
            localStorage.setItem(STORAGE_KEY, json);
        } catch (error) {
            console.log("Erro ao salvar transação: ", error);
        }
    }, [transaction])

    function addTransaction() {

    }

    function updateTransaction() {

    }

    function deleteTransaction() {

    }

    return { transaction, addTransaction, updateTransaction, deleteTransaction };
}