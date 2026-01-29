"use client"

import { expense, ExpenseCategory, revenue, RevenueCategory, Transaction, TypeTransaction } from "@/types";
import { useState } from "react";

interface TransactionFormProps {
    onAdd: (data: Omit<Transaction, 'id'>) => void;
}

export default function TransactionForm({ onAdd }: TransactionFormProps) {
    const [description, setDescription] = useState("");
    const [value, setValue] = useState(0.0);
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

        onAdd(transactionData);

        setDescription("");
        setValue(0);
        setDate("");
        setSelectedCategory("");
        setSelectedType("")
    }

    const categoriesToShow = selectedType === 'Revenue' ? revenue : expense;

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
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
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

                <button type="submit">Adicionar Transação</button>


            </form>
        </div>
    );
}