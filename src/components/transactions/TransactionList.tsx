import { Transaction } from "@/types";
import { TrendingDown, TrendingUp, AlertCircle, Edit2, Trash2 } from "lucide-react";

interface TransactionListProps {
    transaction: Transaction[];
    onDelete: (id: string) => void;
    onEdit: (id: string, data: Omit<Transaction, 'id'>) => void;
    onStartEdit: (transaction: Transaction) => void;
}

export default function TransactionList({ transaction, onDelete, onEdit, onStartEdit }: TransactionListProps) {
    function formatDate(isoString: string) {
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const hour = date.getHours().toString().padStart(2, "0");
        const minute = date.getMinutes().toString().padStart(2, "0");
        return `${day}/${month}/${year} - ${hour}:${minute}`;
    }

    if (transaction.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                <AlertCircle className="w-12 h-12 text-red-500/40 mb-3" />
                <h1 className="text-lg font-semibold text-[rgb(187,225,250)]">Nenhuma transação encontrada</h1>
                <p className="text-[rgb(187,225,250)]/40 text-xs mt-1 px-4">Ajuste os filtros ou adicione uma nova transação.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-3">
            {transaction.map(item => (
                <div key={item.id} className="group bg-[rgb(27,38,44)]/30 hover:bg-[rgb(50,130,184)]/10 border border-[rgb(50,130,184)]/20 rounded-xl p-3 sm:p-4 transition-all overflow-hidden">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.type === 'Revenue' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-red-400/20 text-red-400'}`}>
                                {item.type === 'Revenue' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="text-[rgb(187,225,250)] font-semibold truncate text-sm sm:text-base">{item.description}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] bg-[rgb(50,130,184)]/20 px-1.5 py-0.5 rounded text-[rgb(187,225,250)]/80 truncate max-w-25">{item.category}</span>
                                    <span className="text-[10px] text-[rgb(187,225,250)]/40 whitespace-nowrap hidden sm:inline">{formatDate(item.date)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 gap-1">
                            <div className={`text-sm sm:text-lg font-bold whitespace-nowrap ${item.type === 'Revenue' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {item.type === 'Revenue' ? '+' : '-'} R$ {item.value.toFixed(2)}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onStartEdit(item)} className="p-1 hover:bg-[rgb(50,130,184)]/30 rounded text-[rgb(187,225,250)]/60"><Edit2 size={14} /></button>
                                <button onClick={() => onDelete(item.id)} className="p-1 hover:bg-red-500/20 rounded text-red-400/60"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}