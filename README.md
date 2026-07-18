# MultiFrame Workspace

O **MultiFrame Workspace** é um dashboard web premium, moderno e responsivo, projetado para permitir a visualização e o gerenciamento de 4 páginas de um site (ou sites diferentes) simultaneamente em uma única tela. É a ferramenta ideal para gerenciar múltiplas contas de redes sociais, painéis de monitoramento, ambientes locais de desenvolvimento ou qualquer serviço web que exija multi-sessões.

## ✨ Recursos Principais

- **Visualização em 4 Quadrantes:** Layout padrão 2x2 otimizado para visualização simultânea.
- **Cofre de Credenciais Integrado (Local Locker):** Salve o Usuário e Senha de cada conta localmente de forma segura (`localStorage`). Copie os dados com apenas 1 clique para colá-los rapidamente nas telas de login.
- **Controle de Zoom e Escala de Conteúdo:** Dimensione a escala interna do site (de 50% a 150%) para ajustar perfeitamente páginas completas em blocos menores da grade.
- **Layouts Alternáveis:** Mude o design dinamicamente entre Grid (2x2), Colunas Verticais, Linhas Horizontais ou Foco Centralizado.
- **Zoom de Grade (Maximizar):** Clique duas vezes ou use o botão dedicado para expandir temporariamente um dos frames para tela cheia.
- **Salvamento de Estado e Presets:** URLs, nomes das contas e preferências são salvos de forma automática e persistente. Carregue presets rápidos com um clique.

## 🛠️ Tecnologias Utilizadas

- **HTML5** & **Vanilla JavaScript** (ES6+)
- **CSS3 (Vanilla)** com variáveis, Glassmorphism, CSS Grid, Flexbox e transições de transform.
- **Lucide Icons** para ícones limpos e modernos.
- **Vite** como servidor de desenvolvimento local super rápido.

## 🚀 Como Iniciar

1. Clone o repositório ou baixe os arquivos.
2. No diretório do projeto, instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. O painel abrirá automaticamente em `http://localhost:3000`.

---

> [!WARNING]
> **Bloqueio de iFrames (X-Frame-Options):**
> Alguns sites grandes bloqueiam o carregamento em iFrames por padrão. Para usar qualquer site de sua escolha sem restrições, instale uma extensão de navegador como **"Ignore X-Frame-Options"** na Chrome Web Store.
