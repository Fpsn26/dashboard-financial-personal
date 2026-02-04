"use client"

import { expense, ExpenseCategory, revenue, RevenueCategory, Transaction, TypeTransaction } from "@/types";
import { useEffect, useState } from "react";
import { Plus } from 'lucide-react';

interface TransactionFormProps {
    onAdd: (data: Omit<Transaction, 'id'>) => void;
    onUpdate: (id: string, data: Omit<Transaction, 'id'>) => void;
    editingTransaction: Transaction | null;
    onCancelEdit: () => void;
}

export default function TransactionForm({ onAdd, onUpdate, editingTransaction, onCancelEdit }: TransactionFormProps) {
    const [description, setDescription] = useState("");
    const [value, setValue] = useState(0);
    const [date, setDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | RevenueCategory | ''>("");
    const [selectedType, setSelectedType] = useState<TypeTransaction | ''>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const transactionData: Omit<Transaction, 'id'> = {
            description,
            value,
            type: selectedType as TypeTransaction,
            category: selectedCategory as (ExpenseCategory | RevenueCategory),
            date
        }

        if (editingTransaction) {
            onUpdate(editingTransaction.id, transactionData);
            onCancelEdit();
        } else {
            onAdd(transactionData);
        }

        setDescription("");
        setValue(0);
        setDate("");
        setSelectedCategory("");
        setSelectedType("")
    }

    const categoriesToShow = selectedType === 'Revenue' ? revenue : expense;

    useEffect(() => {
        if (editingTransaction) {
            setDescription(editingTransaction.description);
            setValue(editingTransaction.value);
            setDate(editingTransaction.date);
            setSelectedType(editingTransaction.type);
            setSelectedCategory(editingTransaction.category);
        }
    }, [editingTransaction]);

    return (
        <div className="glass-card p-6">
            <h2 className="text-xl font-bold text- mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {editingTransaction ? "Editar Transação" : "Nova Transação"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-/80 text-sm font-medium mb-2">Descrição</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input-styled" placeholder="Ex: iFood" required />
                </div>

                <div>
                    <label className="block text-/80 text-sm font-medium mb-2">Valor</label>
                    <input type="number" value={value} onChange={(e) => setValue(parseFloat(e.target.value))} className="input-styled" placeholder="0.00" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as TypeTransaction)} className="input-styled" required>
                        <option value="">Tipo</option>
                        <option value="Revenue">Receita</option>
                        <option value="Expense">Despesa</option>
                    </select>

                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as any)} className="input-styled" required>
                        <option value="">Categoria</option>
                        {categoriesToShow.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-/80 text-sm font-medium mb-2">Data</label>
                    <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="input-styled" required />
                </div>

                <button type="submit" className="btn-primary">
                    {editingTransaction ? "Atualizar" : "Adicionar"}
                </button>
            </form>
        </div>
    );
}