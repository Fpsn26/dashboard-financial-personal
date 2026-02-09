"use client"

import { Transaction } from "@/types";
import { useEffect, useState } from "react";

const STORAGE_KEY = 'finance-transactions'

export default function useTransactions() {
    const [transaction, setTransaction] = useState<Transaction[]>([]);

    useEffect(() => {
        try {
            const transactions = localStorage.getItem(STORAGE_KEY);
            if (transactions) {
                const json = JSON.parse(transactions);
                const sorted = json.sort((a: Transaction, b: Transaction) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setTransaction(sorted);
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

    function addTransaction(data: Omit<Transaction, 'id'>) {
        try {
            const id = crypto.randomUUID();

            const newTransaction: Transaction = {
                id,
                description: data.description,
                value: data.value,
                type: data.type,
                category: data.category,
                date: data.date
            }

            setTransaction(prev => {
                const updated = [newTransaction, ...prev];
                return updated.sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
            });
        } catch (error) {
            console.log("Erro na adição de nova transação: ", error);
        }
    }

    function updateTransaction(id: string, updatedData: Partial<Omit<Transaction, 'id'>>) {
        try {
            setTransaction(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, ...updatedData }
                        : item
                )
            )
        } catch (error) {
            console.log("Erro ao atualizar transação: ", error);
        }
    }

    function deleteTransaction(id: string) {
        try {
            setTransaction(prev =>
                prev.filter(item =>
                    item.id !== id
                )
            )
        } catch (error) {
            console.log("Erro ao deletar transação: ", error);
        }
    }

    return { transaction, addTransaction, updateTransaction, deleteTransaction };
}