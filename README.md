# TeamTask - Gerenciador de Tarefas

Aplicação web para cadastrar, listar, filtrar e acompanhar tarefas, com sugestão de prioridade gerada por IA.

🔗 **App hospedado no Vercel:** https://teamtask-gerenciador-de-tarefas.vercel.app

🔗 **API no Render:** https://teamtask-gerenciador-de-tarefas.onrender.com

🔗 **Link do repositório:** https://github.com/beatrizfariasilva/teamtask-gerenciador-de-tarefas/tree/main

---

## Stacks

| Camada | Tecnologia |
|---|---|
| Front-end | React + Vite |
| Back-end | Python + Flask |
| Banco de dados | Supabase |
| IA | Gemini API |
| Deploy | Vercel (front) + Render (back) |

## Funcionalidades

- Criar, listar, atualizar status e excluir tarefas (título, descrição, status)
- Filtrar por status (todas / pendentes / concluídas)
- Sugestão de prioridade das tarefas com Gemini via API
- Interface responsiva

## Arquitetura

```
``` 
teamtask-gerenciador-de-tarefas/
├─ README.md
├─ backend/
│  ├─ app.py
│  ├─ database.py
│  └─ requirements.txt
└─ frontend/
   ├─ index.html
   ├─ package.json
   ├─ vite.config.js
   ├─ public/
   │  ├─ favicon.svg
   │  └─ icons.svg
   └─ src/
      ├─ App.jsx
      ├─ App.css
      ├─ index.css
      ├─ main.jsx
      └─ assets/
         └─ hero.png
```
```

Front-end e back-end são independentes, comunicam-se via HTTP.

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

**Pré-requisitos:** Ter instalado na máquina o Node.js, Python, Git, abrir uma conta no Supabase, configurar uma chave de API do Gemini.

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

- **Supabase** como banco de dados para persistência dos dados.
- **Consumo de API + Ferramenta de IA** como diferencial: o Gemini analisa as tarefas cadastradas e devolve prioridade + motivo curto.
- **Deploy** do backend e frontend para que facilitar a navegação dos usuários pela aplicação.
- **Dados sensíveis em .env** para proteção das chaves e url do banco.

## Uso de IA no desenvolvimento

- **Claude IA** para sugestão e melhoria de interface, principalmente no front. Também auxiliou na implementação de tratamento de erros e validação dos campos. 

- **Codex** para estruturar o prompt enviado ao Gemini. A resposta inicial não vinha em JSON consistente. Com esse auxilio consegui ajustar o prompt para forçar o formato de saída. Também utilizei para correção de identação de todo o código e sugestões de organização de código. 

## Melhorias futuras

- Autenticação de usuários
- Edição de título/descrição da tarefa (hoje só status é atualizado)
- Priorização mais inteligente com IA