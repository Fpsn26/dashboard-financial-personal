import { Transaction } from "@/types";

interface TransactionListProps {
    transaction: Transaction[];
    onDelete: (id: string) => void;
    onEdit: (id: string, data: Omit<Transaction, 'id'>) => void;
}

export default function TransactionList({ transaction, onDelete, onEdit }: TransactionListProps) {
    function formatDate(isoString: string) {
        const date = new Date(isoString);

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const hour = date.getHours().toString().padStart(2, "0");
        const minute = date.getMinutes().toString().padStart(2, "0");

        return (
            `${day}/${month}/${year} - ${hour}:${minute}`
        );
    }

    if (transaction.length === 0) {
        return (
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d91717" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-exclamation-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 9v4" /><path d="M12 16v.01" /></svg>
                <h1>Não existe nenhuma transação!</h1>
            </div>
        );
    }

    return (
        <div>
            {transaction.map(item => (
                <div key={item.id} className="card">
                    <p>Descrição: {item.description}</p>
                    <p>Valor: {item.value}</p>
                    <p>Data: {formatDate(item.date)}</p>
                    <p>Categoria: {item.category}</p>
                    <p>Tipo: {item.type}</p>

                    <button onClick={() => {
                        const { id, ...data } = item;
                        onEdit(id, data)
                    }}>Editar</button>
                    <button onClick={() => onDelete(item.id)}>Excluir</button>
                </div>
            ))}
        </div>
    );
}