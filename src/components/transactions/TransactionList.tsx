import { Transaction } from "@/types";
import { TrendingDown, TrendingUp, AlertCircle, Edit2, Trash2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface TransactionListProps {
    transaction: Transaction[];
    onDelete: (id: string) => void;
    onEdit: (id: string, data: Omit<Transaction, 'id'>) => void;
    onStartEdit: (transaction: Transaction) => void;
}

export default function TransactionList({ transaction, onDelete, onEdit, onStartEdit }: TransactionListProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    function formatDate(isoString: string) {
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    if (transaction.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                <AlertCircle className={`w-12 h-12 mb-3 ${isDark ? 'text-red-500/40' : 'text-red-400'}`} />
                <h1 className={`text-lg font-semibold ${isDark ? 'text-[rgb(187,225,250)]' : 'text-gray-900'}`}>Nenhuma transação encontrada</h1>
                <p className={`text-xs mt-1 px-4 ${isDark ? 'text-[rgb(187,225,250)]/40' : 'text-gray-600'}`}>Ajuste os filtros ou adicione uma nova transação.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-3">
            {transaction.map(item => (
                <div key={item.id} className={`group rounded-xl p-3 sm:p-4 transition-all overflow-hidden border ${isDark ? 'bg-[rgb(15,76,117)]/30 hover:bg-[rgb(50,130,184)]/20 border-[rgb(50,130,184)]/40 backdrop-blur-sm' : 'bg-white hover:bg-gray-50 border-gray-300 shadow-sm'}`}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.type === 'Revenue'
                                ? isDark ? 'bg-emerald-400/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                                : isDark ? 'bg-red-400/20 text-red-400' : 'bg-red-100 text-red-600'
                                }`}>
                                {item.type === 'Revenue' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className={`font-bold truncate text-sm sm:text-base ${isDark ? 'text-[rgb(187,225,250)]' : 'text-gray-900'}`}>{item.description}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded truncate max-w-25 font-semibold ${isDark ? 'bg-[rgb(50,130,184)]/30 text-[rgb(187,225,250)]' : 'bg-blue-100 text-blue-800'}`}>{item.category}</span>
                                    <span className={`text-[10px] whitespace-nowrap hidden sm:inline font-medium ${isDark ? 'text-[rgb(187,225,250)]/60' : 'text-gray-600'}`}>{formatDate(item.date)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 gap-1">
                            <div className={`text-sm sm:text-lg font-bold whitespace-nowrap ${item.type === 'Revenue'
                                ? isDark ? 'text-emerald-300' : 'text-emerald-600'
                                : isDark ? 'text-red-300' : 'text-red-600'
                                }`}>
                                {item.type === 'Revenue' ? '+' : '-'} R$ {item.value.toFixed(2)}
                            </div>
                            <div className="flex gap-2 opacity-100">
                                <button onClick={() => onStartEdit(item)} className={`p-1 rounded ${isDark ? 'hover:bg-[rgb(50,130,184)]/40 text-[rgb(187,225,250)]/70' : 'hover:bg-blue-100 text-blue-600'}`}><Edit2 size={14} /></button>
                                <button onClick={() => onDelete(item.id)} className={`p-1 rounded ${isDark ? 'hover:bg-red-500/30 text-red-300/80' : 'hover:bg-red-100 text-red-600'}`}><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}