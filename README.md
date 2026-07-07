# TeamTask — Gerenciador de Tarefas

Aplicação web para cadastrar, listar, filtrar e acompanhar tarefas, com sugestão de prioridade gerada por IA.

🔗 **App hospedado no Vercel:** https://teamtask-gerenciador-de-tarefas.vercel.app

🔗 **API no Render:** https://teamtask-gerenciador-de-tarefas.onrender.com

🔗 **Link do repositório:** https://github.com/beatrizfariasilva/teamtask-gerenciador-de-tarefas/tree/main

---

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | React + Vite |
| Back-end | Python + Flask |
| Banco de dados | Supabase |
| IA | Gemini API |
| Deploy | Vercel (front) + Render (back) |

## Funcionalidades

- Criar, listar, atualizar e excluir tarefas (título, descrição, status)
- Filtrar por status (todas / pendentes / concluídas)
- Sugestão de prioridade das tarefas via IA, com justificativa
- Interface responsiva

## Arquitetura

```
frontend/  → React + Vite. Interface, chamadas à API, exibição das sugestões de IA
backend/   → Flask. API REST, acesso ao Supabase, integração com Gemini
```

Front-end e back-end são independentes, comunicam-se via HTTP e têm deploys separados.

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/tarefas` | Lista todas as tarefas |
| POST | `/tarefas` | Cria uma tarefa |
| PATCH | `/tarefas/<id>` | Atualiza uma tarefa (ex: status) |
| DELETE | `/tarefas/<id>` | Remove uma tarefa |
| GET | `/tarefas/prioridades` | Retorna sugestão de prioridade via IA |

Exemplo — criar tarefa:
```json
POST /tarefas
{
  "titulo": "Criar front-end",
  "descricao": "Desenvolver a interface da aplicação",
  "status": "Pendente"
}
```

Exemplo — sugestão de prioridade:
```json
GET /tarefas/prioridades
[
  {
    "id": 1,
    "titulo": "Criar front-end",
    "prioridade": "Alta",
    "motivo": "Essa tarefa é essencial para a interação do usuário com o sistema."
  }
]
```

## Como executar localmente

**Pré-requisitos:** Node.js, Python, Git, conta no Supabase, chave de API do Gemini.

**Back-end**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        
pip install -r requirements.txt
```
Crie um `.env` na pasta `backend/`:
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_do_supabase
GEMINI_API_KEY=sua_chave_do_gemini
```
```bash
python app.py 
```

**Front-end**
```bash
cd frontend
npm install
```

```bash
npm run dev
```

## Decisões técnicas

- **Front-end e back-end separados**, conforme exigido no desafio — facilita manutenção e deploy independente.
- **Supabase** como banco de dados para persistência real dos dados.
- **Gemini API** como diferencial: analisa as tarefas cadastradas e devolve prioridade + motivo curto.

## Uso de IA no desenvolvimento

- **Claude IA** para sugestão e melhoria de interface, principalmente no front.
  Com isso, ajustei o tratamento de erros, a validação dos campos e hierarquia visual. 

- **Codex** para estruturar o prompt enviada à Gemini. A resposta inicial não vinha em JSON consistente. Com esse auxilio consegui ajustar o prompt para forçar o formato de saída. Também utilizei para correção de identação de todo o código.

## Melhorias futuras

- Testes automatizados (unitários no back-end, componentes no front-end)
- Autenticação de usuários
- Edição de título/descrição da tarefa (hoje só status é atualizado)