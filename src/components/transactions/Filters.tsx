import { expense, FilterState, revenue } from "@/types";
import { useState } from "react";

interface FiltersProps {
    onFilterChange: (filters: FilterState) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
    const [type, setType] = useState<'all' | 'revenue' | 'expense'>('all');
    const [category, setCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dropdown, setDropdown] = useState(false);

    const handleApplyFilter = () => {
        onFilterChange({
            type,
            category,
            startDate,
            endDate
        });
    }

    const handleClearFilter = () => {
        setType('all');
        setCategory('');
        setStartDate('');
        setEndDate('');

        onFilterChange({
            type: 'all',
            category: '',
            startDate: '',
            endDate: ''
        })
    }

    const categoriesToShow = type === 'revenue' ? revenue : type === 'expense' ? expense : [...revenue, ...expense];

    return (
        <div>
            <button onClick={() => setDropdown(!dropdown)}>
                {dropdown ? 'Fechar Filtros' : 'Abrir Filtros'}
            </button>

            {dropdown && (
                <div>
                    <div>
                        <label>Tipo:</label>
                        <select value={type} onChange={(e) => setType(e.target.value as 'all' | 'revenue' | 'expense')}>
                            <option value="all">Todas</option>
                            <option value="revenue">Receitas</option>
                            <option value="expense">Despesas</option>
                        </select>
                    </div>

                    <div>
                        <label>Categoria:</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Todas as categorias</option>
                            {categoriesToShow.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Data inicial:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Data final:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <button onClick={handleApplyFilter}>Aplicar Filtros</button>
                    <button onClick={handleClearFilter}>Limpar Filtros</button>
                </div>
            )}
        </div>
    );
}