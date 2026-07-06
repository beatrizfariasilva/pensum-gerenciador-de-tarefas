import { useMemo, useState } from "react";
import "./App.css";

const tarefasIniciais = [
  {
    id: 1,
    titulo: "Reuniao de equipe",
    descricao: "Alinhar prioridades da semana e definir responsaveis.",
    status: "Pendente",
  },
  {
    id: 2,
    titulo: "Branding",
    descricao: "Ajustar paleta, logotipo e referencias visuais.",
    status: "Pendente",
  },
  {
    id: 3,
    titulo: "Relatorio do cliente",
    descricao: "Fechar os numeros do mes e revisar observacoes.",
    status: "Pendente",
  },
  {
    id: 4,
    titulo: "Revisar contrato",
    descricao: "Validacao final do documento.",
    status: "Concluida",
  },
];

function App() {
  const [tarefas, setTarefas] = useState(tarefasIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [filtro, setFiltro] = useState("Listar todas");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  function criarTarefa(event) {
    event.preventDefault();

    if (!titulo.trim()) return;

    const novaTarefa = {
      id: Date.now(),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      status: "Pendente",
    };

    setTarefas([novaTarefa, ...tarefas]);
    setTitulo("");
    setDescricao("");
    setModalAberto(false);
  }

  function alterarStatus(id) {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id
          ? {
              ...tarefa,
              status:
                tarefa.status === "Concluida" ? "Pendente" : "Concluida",
            }
          : tarefa
      )
    );
  }

  function deletarTarefa(id) {
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  }

  const tarefasFiltradas = useMemo(() => {
    if (filtro === "Pendentes") {
      return tarefas.filter((tarefa) => tarefa.status === "Pendente");
    }

    if (filtro === "Concluidas") {
      return tarefas.filter((tarefa) => tarefa.status === "Concluida");
    }

    return tarefas;
  }, [tarefas, filtro]);

  const totalPendentes = tarefas.filter(
    (tarefa) => tarefa.status === "Pendente"
  ).length;

  const totalConcluidas = tarefas.filter(
    (tarefa) => tarefa.status === "Concluida"
  ).length;

  return (
    <main className="app">
      <header className="topo">
        <button className="botao-novo" onClick={() => setModalAberto(true)}>
          + Nova task
        </button>

        <h1>TeamTask.</h1>

        <select value={filtro} onChange={(event) => setFiltro(event.target.value)}>
          <option>Listar todas</option>
          <option>Pendentes</option>
          <option>Concluidas</option>
        </select>
      </header>

      <section className="linha-status">
        <span>{tarefas.length} tarefas</span>
        <span>{totalPendentes} pendentes</span>
        <span>{totalConcluidas} concluidas</span>
      </section>

      <section className="grade">
        {tarefasFiltradas.map((tarefa) => (
          <article
            className={`pasta ${
              tarefa.status === "Concluida" ? "concluida" : ""
            }`}
            key={tarefa.id}
          >
            <div className="aba" />

            <div className="conteudo-pasta">
              <div className="etiqueta-arquivo">
                <div className="campo">
                  <span>Título</span>
                  {tarefa.titulo}
                </div>

                <div className="campo">
                  <span>Descrição</span>
                  <p>{tarefa.descricao || "Sem descricao."}</p>
                </div>
              </div>

              <div className="botoes-card">
                <button
                  className="botao-concluir"
                  onClick={() => alterarStatus(tarefa.id)}
                >
                  {tarefa.status === "Concluida"
                    ? "Voltar para pendente"
                    : "Marcar como concluida"}
                </button>

                <button
                  className="botao-deletar"
                  onClick={() => deletarTarefa(tarefa.id)}
                >
                  Excluir tarefa
                </button>
              </div>
            </div>
          </article>
        ))}

        {tarefasFiltradas.length === 0 && (
          <div className="vazio">Nenhuma tarefa encontrada.</div>
        )}
      </section>

      {modalAberto && (
        <div className="modal">
          <form className="formulario" onSubmit={criarTarefa}>
            <div className="topo-formulario">
              <h2>Nova tarefa</h2>

              <button type="button" onClick={() => setModalAberto(false)}>
                x
              </button>
            </div>

            <label>
              Titulo
              <input
                type="text"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
              />
            </label>

            <label>
              Descricao
              <textarea
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
              />
            </label>

            <button className="salvar" type="submit">
              Criar tarefa
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

export default App;