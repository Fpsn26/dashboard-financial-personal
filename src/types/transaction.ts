export type Transaction = {
    id: string;
    description: string;
    value: number;
    type: TypeTransaction;
    category: CategoryType;
    date: string;
}

export type TypeTransaction = 'Revenue' | 'Expense';

export type ExpenseCategory = 'Alimentação' | 'Transporte' | 'Saúde' | 'Lazer e Viagens' | 'Habitação' | 'Educação' | 'Streaming' | 'Cuidados com Pets' | 'Apostas (Bets)';

export type RevenueCategory = 'Salário' | 'Freelance' | 'Investimento' | 'Restituição IR' | 'Benefícios Sociais';

type CategoryType = RevenueCategory | ExpenseCategory;