"use client"

import { expense, ExpenseCategory, revenue, RevenueCategory, Transaction, TypeTransaction } from "@/types";
import { useEffect, useState } from "react";

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
        <div className="bg-[rgb(50,130,184)] rounded-lg m-5">
            <form onSubmit={handleSubmit} className="grid p-6">
                <label>Descrição: </label>
                <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Digite a descrição da transação"
                    required
                />

                <label>Valor: </label>
                <input
                    type="number"
                    name="value"
                    value={value}
                    onChange={(e) => setValue(parseFloat(e.target.value))}
                    placeholder="Digite o valor da transação. Ex.: 17,50"
                    required
                />

                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as TypeTransaction)} required>
                    <option value="">Selecione o tipo</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Expense">Expense</option>
                </select>

                {selectedType && (
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as ExpenseCategory | RevenueCategory)} required>
                        <option value="categoria">Selecione uma categoria</option>
                        {categoriesToShow.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                )}

                <label>Data: </label>
                <input
                    type="datetime-local"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Selecione a data que a transação foi feita"
                    required
                />

                <button type="submit">
                    {editingTransaction ? "Atualizar Transação" : "Adicionar Transação"}
                </button>

                {editingTransaction && (
                    <button type="button" onClick={onCancelEdit}>
                        Cancelar Edição
                    </button>
                )}

            </form>
        </div>
    );
}