import { expense, ExpenseCategory, revenue, RevenueCategory, TypeTransaction } from "@/types";
import { useEffect, useState } from "react";

const STORAGE_KEY_REVENUE = 'revenue-custom';
const STORAGE_KEY_EXPENSE = 'expense-custom';

export default function useCategories() {
    const [customRevenue, setCustomRevenue] = useState<RevenueCategory[]>([]);
    const [customExpense, setCustomExpense] = useState<ExpenseCategory[]>([]);

    useEffect(() => {
        try {
            const revenue = localStorage.getItem(STORAGE_KEY_REVENUE);
            if (revenue) {
                const json = JSON.parse(revenue);
                setCustomRevenue(json);
            }
        } catch (error) {
            console.log("Erro ao carregar categoria (Receita): ", error);
        }

    }, []);

    useEffect(() => {
        try {
            const expense = localStorage.getItem(STORAGE_KEY_EXPENSE);
            if (expense) {
                const json = JSON.parse(expense);
                setCustomExpense(json);
            }
        } catch (error) {
            console.log("Erro ao carregar categoria (Despesa): ", error);
        }

    }, [])

    useEffect(() => {
        try {
            const json = JSON.stringify(customRevenue);
            localStorage.setItem(STORAGE_KEY_REVENUE, json);
        } catch (error) {
            console.log("Erro ao salvar categoria (Receita): ", error);
        }
    }, [customRevenue]);

    useEffect(() => {
        try {
            const json = JSON.stringify(customExpense);
            localStorage.setItem(STORAGE_KEY_EXPENSE, json);
        } catch (error) {
            console.log("Erro ao salvar categoria (Despesa): ", error);
        }
    }, [customExpense]);

    function addCategory(nameCategory: RevenueCategory | ExpenseCategory, type: TypeTransaction) {
        try {
            if (type === 'Revenue') {
                if ([...revenue, ...customRevenue].includes(nameCategory as RevenueCategory)) {
                    console.log("Categoria ja existente!");
                    return;
                }
                setCustomRevenue(prev => {
                    const updatedRevenue = [nameCategory as RevenueCategory, ...prev];
                    return updatedRevenue;
                })
            }

            if (type === 'Expense') {
                if ([...expense, ...customExpense].includes(nameCategory as ExpenseCategory)) {
                    console.log("Categoria ja existente!");
                    return;
                }
                setCustomExpense(prev => {
                    const updatedExpense = [nameCategory as ExpenseCategory, ...prev];
                    return updatedExpense;
                })
            }
        } catch (error) {
            console.log("Erro ao adicionar categoria: ", error);
        }
    }

    return { customRevenue, customExpense, addCategory };
}