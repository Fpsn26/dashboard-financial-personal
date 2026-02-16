import { Transaction } from "@/types";
import { sortByDate } from "@/utils/transaction";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TransactionStore {
  transaction: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, updatedData: Partial<Omit<Transaction, "id">>) => void;
  deleteTransaction: (id: string) => void;
}

sortByDate([]);

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transaction: [],

      addTransaction: (data) => {
        const id = crypto.randomUUID();

        const newTransaction: Transaction = {
          id,
          description: data.description,
          value: data.value,
          type: data.type,
          category: data.category,
          date: data.date,
        };
        set((state) => ({ transaction: sortByDate([newTransaction, ...state.transaction]) }));
      },

      updateTransaction: (id, updatedData) => {
        set((state) => ({
          transaction: state.transaction.map((item) =>
            item.id === id ? { ...item, ...updatedData } : item,
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transaction: state.transaction.filter((item) => item.id !== id),
        }));
      },
    }),
    {
      name: "finance-transactions",
      onRehydrateStorage: () => {
        console.log("Iniciando hidratação das transações");

        return (state, error) => {
          if (error) {
            console.log("Erro ao reidratar transações: ", error);
          } else {
            if (state?.transaction) {
              const sortedTransactions = sortByDate(state.transaction);
              state.transaction = sortedTransactions;
            }
            console.log("Hidratação das transações finalizada");
          }
        };
      },
    },
  ),
);
