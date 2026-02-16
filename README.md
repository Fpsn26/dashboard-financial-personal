# 📊 Financial Dashboard
Projeto de um dashboard de finanças pessoais interativo desenvolvido com React, Next.js e TypeScript. O sistema permite ao usuário gerenciar suas receitas e despesas, oferecendo uma visão clara do saldo total, filtragem dinâmica de transações e visualização de dados através de gráficos. O projeto foi construído com foco em qualidade de código, performance e uma experiência de usuário moderna.

## 🔗 Demonstração
Acesse o projeto online: [CLIQUE AQUI PARA ACESSAR O SITE](https://dashboard-financial-rouge.vercel.app/)

## 🚀 Tecnologias
- **Framework**: Next.js 16 (App Router)
- **Biblioteca UI**: React 19
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS 4
- **Gerenciamento de Estado**: Zustand (com persistência via middleware)
- **Gráficos**: Chart.js / React-Chartjs-2
- **Ícones**: Lucide React
- **Testes**: Vitest
- **Qualidade de Código**: ESLint, Prettier, Husky, lint-staged
- **CI/CD**: GitHub Actions
- **Deploy**: Vercel

## ✨ Funcionalidades
- **Gerenciamento de Transações**: Adição, edição e exclusão de receitas e despesas com armazenamento persistente via Zustand + `localStorage`.
- **Resumo Financeiro**: Cards dinâmicos com total de receitas, despesas e saldo líquido.
- **Filtros Avançados**: Filtragem por tipo, categoria e intervalo de datas.
- **Alternância de Temas**: Suporte nativo a Modo Dark e Modo Light com persistência.
- **Visualização por Gráficos**: Gráfico de pizza interativo que agrupa gastos por categoria.
- **Design Responsivo**: Interface adaptada para dispositivos móveis e desktop, utilizando Glassmorphism.

## 🛡️ Qualidade de Código
- **ESLint** com regras para Next.js e TypeScript (flat config)
- **Prettier** com formatação automática ao salvar no VS Code
- **Husky + lint-staged** bloqueando commits com erros de lint ou formatação
- **GitHub Actions** rodando lint, testes e build a cada push para `main`
- **Testes unitários** com Vitest cobrindo funções de data e ordenação

## 📋 Pré-requisitos
- Bun instalado (versão 1.0 ou superior) — [Instalar Bun](https://bun.sh)

## 🖥️ Como rodar o projeto localmente
1. Clone o repositório
```bash
git clone https://github.com/Fpsn26/dashboard-financial-personal
```
2. Instale as dependências
```bash
bun install
```
3. Execute o projeto
```bash
bun run dev
```
4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🧪 Rodando os testes
```bash
bun test
```

## 📚 Aprendizados
Durante o desenvolvimento deste projeto, aprimorei meus conhecimentos em:
- **Gerenciamento de Estado**: Migração de hooks customizados para Zustand com middleware de persistência.
- **Qualidade de Código**: Configuração de ESLint (flat config), Prettier e Husky para garantir padrões automáticos em todo commit.
- **Testes Unitários**: Escrita de testes com Vitest para funções puras, incluindo verificação de imutabilidade de arrays.
- **CI/CD**: Criação de pipeline com GitHub Actions para validar lint, testes e build automaticamente.
- **Estilização Avançada**: Exploração das novas capacidades do Tailwind CSS 4.
- **Gráficos Dinâmicos**: Integração do Chart.js com o estado do React para atualizações em tempo real.
- **Boas Práticas**: Separação de lógica pura em utilitários testáveis, commits com Conventional Commits e uso de Conventional Commits.

## Contribuições e Feedbacks
Feedbacks e sugestões de melhorias são bem-vindos e fundamentais para o aprimoramento deste projeto. Sinta-se à vontade para entrar em contato ou abrir uma issue no repositório.

## 👤 Autor
**Felipe Sanches Nunes**
[LinkedIn](https://www.linkedin.com/in/felipe-sanches-nunes/)
