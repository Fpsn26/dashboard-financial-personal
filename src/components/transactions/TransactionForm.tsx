"use client"

import { expense, ExpenseCategory, revenue, RevenueCategory, Transaction, TypeTransaction } from "@/types";
import { useEffect, useState } from "react";
import { Plus, X } from 'lucide-react';
import { useTheme } from "@/components/theme/ThemeProvider";
import CustomSelect from "../select/CustomSelect";
import useCategories from "@/hooks/useCategories";
import { DatePicker } from "../tailgrids/core/single-date";

function formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

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
    const [date, setDate] = useState<Date | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | RevenueCategory | ''>("");
    const [selectedType, setSelectedType] = useState<TypeTransaction | ''>("");
    const [errors, setErrors] = useState({
        description: false,
        value: false,
        type: false,
        category: false,
        duplicateCategory: false,
        customCategory: false
    });
    const { customRevenue, customExpense, addCategory } = useCategories();
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customCategoryText, setCustomCategoryText] = useState<ExpenseCategory | RevenueCategory | ''>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErros = {
            description: !description.trim(),
            value: !value || value <= 0,
            type: !selectedType,
            category: !selectedCategory,
            duplicateCategory: false,
            customCategory: false
        }

        setErrors(newErros);

        if (Object.values(newErros).some(error => error)) {
            return;
        }

        const finalDate = date
            ? formatDateToISO(date)
            : formatDateToISO(new Date());

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
        setDate(null);
        setSelectedCategory("");
        setSelectedType("")
        setErrors({
            description: false,
            value: false,
            type: false,
            category: false,
            duplicateCategory: false,
            customCategory: false
        });
    }

    const categoriesToShow = selectedType === 'Revenue'
        ? [...revenue, ...customRevenue]
        : [...expense, ...customExpense];

    useEffect(() => {
        if (editingTransaction) {
            setDescription(editingTransaction.description);
            setValue(editingTransaction.value);
            setDate(new Date(editingTransaction.date));
            setSelectedType(editingTransaction.type);
            setSelectedCategory(editingTransaction.category);
        }

        if (!editingTransaction) {
            setDescription("");
            setValue('');
            setDate(null);
            setSelectedCategory("");
            setSelectedType("")
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
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setErrors(prev => ({ ...prev, description: false }));
                        }}
                        className={`input-styled ${errors.description ? 'border-red-500 border-2' : ''}`}
                        placeholder="Ex: iFood"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">Por favor, preencha a descrição</p>
                    )}
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[rgb(187,225,250)]' : 'text-gray-700'}`}>Valor</label>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            setValue(inputValue === '' ? '' : parseFloat(inputValue));
                            setErrors(prev => ({ ...prev, value: false }));
                        }}
                        step="0,01"
                        className={`input-styled ${errors.value ? 'border-red-500 border-2' : ''}`}
                        placeholder="00,00"
                    />
                    {errors.value && (
                        <p className="text-red-500 text-xs mt-1">Por favor, insira um valor válido maior que zero</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <CustomSelect
                            value={selectedType}
                            onChange={(value) => {
                                setSelectedType(value as TypeTransaction);
                                setErrors(prev => ({ ...prev, type: false }));
                            }}
                            options={[
                                { value: '', label: 'Tipo' },
                                { value: 'Revenue', label: 'Receita' },
                                { value: 'Expense', label: 'Despesa' }
                            ]}
                            placeholder="Tipo"
                            error={errors.type}
                        />
                        {errors.type && (
                            <p className="text-red-500 text-xs mt-1">Por favor, selecione um tipo</p>
                        )}
                    </div>

                    <div>
                        <CustomSelect
                            value={selectedCategory}
                            onChange={(value) => {
                                if (value !== 'customCategory') {
                                    setSelectedCategory(value as any);
                                    setShowCustomInput(false);
                                } else {
                                    setShowCustomInput(true);
                                }
                                setErrors(prev => ({ ...prev, category: false }));
                            }}
                            options={[
                                { value: '', label: 'Categoria' },
                                ...categoriesToShow.map(cat => ({ value: cat, label: cat })),
                                { value: 'customCategory', label: '+ Adicionar Categoria' }
                            ]}
                            placeholder="Categoria"
                            disabled={!selectedType}
                            error={errors.category}
                        />
                        {errors.category && (
                            <p className="text-red-500 text-xs mt-1">Por favor, selecione uma categoria</p>
                        )}
                    </div>

                    {showCustomInput &&
                        <div className="col-span-2 flex flex-col gap-2">
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[rgb(187,225,250)]' : 'text-gray-700'}`}>Nova Categoria</label>

                            <div className="grid grid-cols-[1fr_auto] gap-2 items-start">
                                <div className="flex flex-col w-full">
                                    <input
                                        type="text"
                                        placeholder="Ex: Academia"
                                        value={customCategoryText}
                                        onChange={(e) => {
                                            setCustomCategoryText(e.target.value as RevenueCategory | ExpenseCategory);
                                            setErrors(prev => ({ ...prev, duplicateCategory: false, customCategory: false }));
                                        }}
                                        className={`input-styled w-full h-10.5 ${errors.customCategory || errors.duplicateCategory ? 'border-red-500 border-2' : ''}`}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (customCategoryText === '') {
                                            setErrors(prev => ({ ...prev, customCategory: true }));
                                            return;
                                        }
                                        const formatedCustomCategory = customCategoryText.charAt(0).toUpperCase() + customCategoryText.slice(1).toLowerCase();
                                        if ((categoriesToShow as string[]).includes(formatedCustomCategory)) {
                                            setErrors(prev => ({ ...prev, duplicateCategory: true }));
                                            return;
                                        }
                                        addCategory(formatedCustomCategory as any, selectedType as TypeTransaction);
                                        setShowCustomInput(false);
                                        setSelectedCategory(formatedCustomCategory as any);
                                        setCustomCategoryText('');
                                    }}
                                    className="btn-primary px-6 h-10.5 whitespace-nowrap text-sm font-semibold"
                                >
                                    Adicionar
                                </button>

                                {(errors.duplicateCategory || errors.customCategory) && (
                                    <div className="col-span-2">
                                        {errors.duplicateCategory && (
                                            <p className="text-red-500 text-xs mt-1">Essa categoria já existe</p>
                                        )}
                                        {errors.customCategory && (
                                            <p className="text-red-500 text-xs mt-1">Por favor, digite o nome da categoria</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[rgb(187,225,250)]' : 'text-gray-700'}`}>Data (Opcional)</label>
                    <DatePicker value={date} onChange={(date: Date | null) => setDate(date)} className="bg-[rgba(var(--primary-900),0.5)] border-1px border-solid border-[rgba(var(--primary-600), 0.3)] text-sm" />
                </div>

                <button type="submit" className="btn-primary">
                    {editingTransaction ? "Atualizar" : "Adicionar"}
                </button>
            </form>
        </div>
    );
}