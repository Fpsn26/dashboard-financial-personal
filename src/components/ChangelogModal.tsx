"use client"

import { useTheme } from "@/components/ThemeProvider";
import { X, Sparkles, Bug, Zap, ChevronDown, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";

const CURRENT_VERSION = "1.3.0";
const STORAGE_KEY = "app-version-seen";

interface Update {
    type: "feature" | "bugfix" | "improvement";
    text: string;
}

interface VersionChangelog {
    version: string;
    date: string;
    updates: Update[];
}

const changelog: VersionChangelog[] = [
    {
        version: "1.3.0",
        date: "Fevereiro 2026",
        updates: [
            { type: "improvement", text: "Valores do formulário agora são zerados ao cancelar edição" },
            { type: "improvement", text: "Aumentado tamanho da área de lista de transações para melhor visualização" },
            { type: "feature", text: "Novas categorias de Despesas: Habitação, Educação, Streaming, Cuidados com Pets e Apostas (Bets)" },
            { type: "feature", text: "Novas categorias de Receitas: Restituição IR e Benefícios Sociais" },
            { type: "feature", text: "Componente de seleção totalmente personalizado com scroll e melhor organização" },
            { type: "improvement", text: "Filtros agora fecham automaticamente ao clicar fora da área" },
            { type: "feature", text: "Modal de 'Novidades' para exibir atualizações e correções a cada nova versão" },
        ]
    },
    {
        version: "1.2.0",
        date: "Fevereiro 2026",
        updates: [
            { type: "improvement", text: "Gráfico de pizza ajustado para melhor responsividade em telas maiores" },
            { type: "bugfix", text: "Corrigido tamanho do campo de data no mobile" },
            { type: "bugfix", text: "Ajustado botão de aplicar filtros no mobile" },
            { type: "bugfix", text: "Data agora aparece corretamente em dispositivos móveis" },
            { type: "improvement", text: "Mensagens de validação substituíram alertas nos campos obrigatórios" },
        ]
    },
    {
        version: "1.1.0",
        date: "Fevereiro 2026",
        updates: [
            { type: "feature", text: "Campo de data agora é opcional - usa data atual automaticamente" },
            { type: "improvement", text: "Removida aceitação de valores zero nas transações" },
            { type: "bugfix", text: "Corrigido ícone de editar transação em dispositivos móveis" },
            { type: "improvement", text: "Campo de valor não inicia mais com zero ao digitar" },
        ]
    }
];

export default function ChangelogModal() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isOpen, setIsOpen] = useState(false);
    const [showAllVersions, setShowAllVersions] = useState(false);

    useEffect(() => {
        const seenVersion = localStorage.getItem(STORAGE_KEY);

        if (seenVersion !== CURRENT_VERSION) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem(STORAGE_KEY, CURRENT_VERSION);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    const latestVersion = changelog[0];
    const olderVersions = changelog.slice(1);

    const getIcon = (type: Update["type"]) => {
        switch (type) {
            case "feature":
                return <Sparkles size={16} className="text-blue-400" />;
            case "bugfix":
                return <Bug size={16} className="text-red-400" />;
            case "improvement":
                return <Zap size={16} className="text-yellow-400" />;
        }
    };

    const getLabel = (type: Update["type"]) => {
        switch (type) {
            case "feature":
                return "Novo";
            case "bugfix":
                return "Correção";
            case "improvement":
                return "Melhoria";
        }
    };

    const getBadgeColor = (type: Update["type"]) => {
        switch (type) {
            case "feature":
                return isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700';
            case "bugfix":
                return isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700';
            case "improvement":
                return isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in"
                onClick={handleClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-8 md:p-12 pointer-events-none">
                <div
                    className={`pointer-events-auto w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 ${isDark
                        ? 'bg-[rgb(27,38,44)] border-[rgb(50,130,184)]/40'
                        : 'bg-white border-gray-200'
                        }`}
                >
                    <div className={`p-6 border-b ${isDark ? 'border-[rgb(50,130,184)]/20' : 'border-gray-200'
                        }`}>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-[rgb(187,225,250)]' : 'text-gray-900'
                                    }`}>
                                    <Sparkles className="text-blue-400" />
                                    Novidades!
                                </h2>
                                <p className={`text-sm mt-1 ${isDark ? 'text-[rgb(187,225,250)]/60' : 'text-gray-600'
                                    }`}>
                                    Versão {latestVersion.version} - {latestVersion.date}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className={`p-2 rounded-lg transition-colors shrink-0 ${isDark
                                    ? 'hover:bg-[rgb(50,130,184)]/20 text-[rgb(187,225,250)]/60'
                                    : 'hover:bg-gray-100 text-gray-600'
                                    }`}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[rgb(50,130,184)]/20">
                        <div>
                            <div className="space-y-2">
                                {latestVersion.updates.map((update, index) => (
                                    <div
                                        key={index}
                                        className={`flex gap-3 p-3 rounded-lg transition-colors ${isDark
                                            ? 'bg-[rgb(15,76,117)]/30 hover:bg-[rgb(15,76,117)]/40'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="shrink-0 mt-0.5">
                                            {getIcon(update.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getBadgeColor(update.type)}`}>
                                                {getLabel(update.type)}
                                            </span>
                                            <p className={`text-sm mt-2 ${isDark ? 'text-[rgb(187,225,250)]' : 'text-gray-700'
                                                }`}>
                                                {update.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {olderVersions.length > 0 && (
                            <>
                                <button
                                    onClick={() => setShowAllVersions(!showAllVersions)}
                                    className={`w-full flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors ${isDark
                                        ? 'text-[rgb(187,225,250)]/70 hover:text-[rgb(187,225,250)]'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <span>{showAllVersions ? 'Ocultar' : 'Ver'} atualizações anteriores</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${showAllVersions ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {showAllVersions && (
                                    <div className="space-y-6 pt-4 border-t border-[rgb(50,130,184)]/20">
                                        {olderVersions.map((versionData) => (
                                            <div key={versionData.version}>
                                                <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-[rgb(187,225,250)]/80' : 'text-gray-700'
                                                    }`}>
                                                    v{versionData.version} - {versionData.date}
                                                </h3>
                                                <div className="space-y-2">
                                                    {versionData.updates.map((update, index) => (
                                                        <div
                                                            key={index}
                                                            className={`flex gap-2 p-2 rounded text-sm ${isDark
                                                                ? 'bg-[rgb(15,76,117)]/20'
                                                                : 'bg-gray-50'
                                                                }`}
                                                        >
                                                            <div className="shrink-0 mt-0.5">
                                                                {getIcon(update.type)}
                                                            </div>
                                                            <p className={isDark ? 'text-[rgb(187,225,250)]/80' : 'text-gray-600'}>
                                                                {update.text}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className={`p-6 border-t ${isDark ? 'border-[rgb(50,130,184)]/20' : 'border-gray-200'
                        }`}>
                        <button
                            onClick={handleClose}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <span>Entendi! Vamos lá</span>
                            <PartyPopper size={18} />
                        </button>
                        <p className={`text-center text-xs mt-3 ${isDark ? 'text-[rgb(187,225,250)]/40' : 'text-gray-500'
                            }`}>
                            Obrigado por usar nosso aplicativo!
                        </p>
                    </div>
                </div>
            </div >
        </>
    );
}