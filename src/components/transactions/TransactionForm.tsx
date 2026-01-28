import { expense, revenue } from "@/types";
import { useEffect, useState } from "react";

export default function TransactionForm() {
    const [description, setDescription] = useState("");
    const [value, setValue] = useState(0);
    const [date, setDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedType, setSelectedType] = useState("");

    const categoriesToShow = selectedType === 'revenue' ? revenue : expense;

    return (
        <div>
            <form>
                <input
                    type="text"
                    name="description"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Digite a descrição da transação"
                />

                <input
                    type="number"
                    name="value"
                    onChange={(e) => setValue(parseFloat(e.target.value))}
                    placeholder="Digite o valor da transação. Ex.: 17.50"
                />

                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
                </select>

                {selectedType && (
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="categoria">Selecione uma categoria</option>
                        {categoriesToShow.map(cat => (
                            <option></option>
                        ))}
                    </select>
                )}

            </form>
        </div>
    );
}