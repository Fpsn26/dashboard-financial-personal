"use client"

import { expense, ExpenseCategory, revenue, RevenueCategory, Transaction, TypeTransaction } from "@/types";
import { useEffect, useState } from "react";
import { Plus, X } from 'lucide-react';
import { useTheme } from "@/components/ThemeProvider";

interface TransactionFormProps {
    onAdd: (data: Omit<Transaction, 'id'>) => void;
    onUpdate: (id: string, data: Omit<Transaction, 'id'>) => void;
    editingTransaction: Transaction | null;
    onCancelEdit: () => void;
}

export default function TransactionForm({ onAdd, onUpdate, editingTransaction, onCancelEdit }: TransactionFormProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [description, setDescription] = useState("");
    const [value, setValue] = useState<number | ''>('');
    const [date, setDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | RevenueCategory | ''>("");
    const [selectedType, setSelectedType] = useState<TypeTransaction | ''>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!value || value <= 0) {
            alert('Por favor, insira um valor maior que zero');
            return;
        }

        const finalDate = date || new Date().toISOString().split('T')[0];

        const transactionData: Omit<Transaction, 'id'> = {
            description,
            value: Number(value),
            type: selectedType as TypeTransaction,
            category: selectedCategory as (ExpenseCategory | RevenueCategory),
            date: finalDate
        }

        if (editingTransaction) {
            onUpdate(editingTransaction.id, transactionData);
            onCancelEdit();
        } else {
            onAdd(transactionData);
        }

        setDescription("");
        setValue('');
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
            <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-[rgb(187,225,250)]' : 'text-gray-900'}`}>
                    <Plus className="w-5 h-5" />
                    {editingTransaction ? "Editar Transação" : "Nova Transação"}
                </h2>
                {editingTransaction && (
                    <button
                        onClick={onCancelEdit}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-[rgb(50,130,184)]/20 text-[rgb(187,225,250)]/60' : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[rgb(187,225,250)]' : 'text-gray-700'}`}>Descrição</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input-styled" placeholder="Ex: iFood" required />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[rgb(187,225,250)]' : 'text-gray-700'}`}>Valor</label>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            setValue(inputValue === '' ? '' : parseFloat(inputValue));
                        }}
                        step="0,01"
                        className="input-styled"
                        placeholder="00,00"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as TypeTransaction)} className="input-styled" required>
                            <option value="">Tipo</option>
                            <option value="Revenue">Receita</option>
                            <option value="Expense">Despesa</option>
                        </select>
                    </div>

                    <div>
                        {selectedType &&
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as any)} className="input-styled" required>
                                <option value="">Categoria</option>
                                {categoriesToShow.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        }
                    </div>
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[rgb(187,225,250)]' : 'text-gray-700'}`}>Data (Opcional)</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-styled" />
                </div>

                <button type="submit" className="btn-primary">
                    {editingTransaction ? "Atualizar" : "Adicionar"}
                </button>
            </form>
        </div>
    );
}