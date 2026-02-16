import { describe, it, expect } from "vitest";
import { formatDateToISO } from "./date";
import { sortByDate } from "./transaction";
import { Transaction } from "@/types";

describe("formatDateToISO", () => {
  it("deve retornar a data no formato YYYY-MM-DD", () => {
    const data = new Date(2024, 0, 9);
    expect(formatDateToISO(data)).toBe("2024-01-09");
  });

  it("deve adicionar zero à esquerda em dia e mês menores que 10", () => {
    const data = new Date(2024, 2, 5);
    expect(formatDateToISO(data)).toBe("2024-03-05");
  });
});

describe("sortByDate", () => {
  it("deve ordenar do mais recente para o mais antigo", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        date: "2024-01-01",
        description: "",
        value: 0,
        type: "Expense",
        category: "Alimentação",
      },
      {
        id: "2",
        date: "2024-03-15",
        description: "",
        value: 0,
        type: "Expense",
        category: "Alimentação",
      },
      {
        id: "3",
        date: "2024-02-10",
        description: "",
        value: 0,
        type: "Expense",
        category: "Alimentação",
      },
    ];

    const resultado = sortByDate(transactions);

    expect(resultado[0].id).toBe("2");
    expect(resultado[1].id).toBe("3");
    expect(resultado[2].id).toBe("1");
  });

  it("não deve mutar o array original", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        date: "2024-01-01",
        description: "",
        value: 0,
        type: "Expense",
        category: "Alimentação",
      },
      {
        id: "2",
        date: "2024-03-15",
        description: "",
        value: 0,
        type: "Expense",
        category: "Alimentação",
      },
    ];

    const ordemOriginal = transactions.map((t) => t.id);
    sortByDate(transactions);
    const ordemDepois = transactions.map((t) => t.id);

    expect(ordemDepois).toEqual(ordemOriginal);
  });
});
