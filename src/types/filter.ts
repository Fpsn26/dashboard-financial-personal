export type FilterState = {
    type: 'all' | 'Revenue' | 'Expense';
    category: string;
    startDate: string;
    endDate: string;
}