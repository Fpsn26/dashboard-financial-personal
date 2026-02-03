import { expense, revenue, Transaction, TypeTransaction } from "@/types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

interface PieChartProps {
    transaction: Transaction[];
    type: TypeTransaction | 'all';
}

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ transaction, type }: PieChartProps) {
    const filteredByFilter = transaction.filter(t => {
        if (type === 'all') return true;
        return t.type === type;
    })

    const grouped = filteredByFilter.reduce((acc, transaction) => {
        if (acc[transaction.category]) {
            acc[transaction.category] += transaction.value;
        } else {
            acc[transaction.category] = transaction.value;
        }
        return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(grouped);
    const values = Object.values(grouped);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

    const data = {
        labels,
        datasets: [{
            data: values,
            backgroundColor: colors,
        }]
    }

    return (
        <Pie data={data} />
    );
}