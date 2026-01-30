export type FilterState = {
    type: 'all' | 'revenue' | 'expense';
    category: string;
    startDate: string;
    endDate: string;
}