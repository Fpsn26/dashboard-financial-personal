export type Transaction = {
    id: string;
    description: string;
    value: number;
    type: TypeTransaction;
    category: CategoryType;
    date: string;
}

type TypeTransaction = 'revenue' | 'expense';

export type ExpenseCategory = 'Alimentação' | 'Transporte' | 'Saúde' | 'Lazer';

export type RevenueCategory = 'Salário' | 'Freelance' | 'Investimento';

type CategoryType = RevenueCategory | ExpenseCategory;