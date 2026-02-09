import { expense, revenue, Transaction, TypeTransaction } from "@/types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useTheme } from "@/components/theme/ThemeProvider";

interface PieChartProps {
    transaction: Transaction[];
    type: TypeTransaction | 'all';
}

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ transaction, type }: PieChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
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
            borderWidth: isDark ? 0 : 2,
            borderColor: isDark ? 'transparent' : '#fff',
        }]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: isDark ? 'rgb(187, 225, 250)' : 'rgb(31, 41, 55)',
                    font: {
                        size: 12,
                        weight: '500' as const
                    }
                }
            },
            tooltip: {
                backgroundColor: isDark ? 'rgba(27, 38, 44, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                titleColor: isDark ? 'rgb(187, 225, 250)' : 'rgb(31, 41, 55)',
                bodyColor: isDark ? 'rgb(187, 225, 250)' : 'rgb(75, 85, 99)',
                borderColor: isDark ? 'rgb(50, 130, 184)' : 'rgb(229, 231, 235)',
                borderWidth: 1,
            }
        }
    }

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="w-full max-w-xs md:max-w-sm">
                <Pie data={data} />
            </div>
        </div>
    );
}