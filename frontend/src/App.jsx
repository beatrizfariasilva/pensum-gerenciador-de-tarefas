import { useState, useEffect } from "react";
import "./App.css";

const PALETA = ["azul", "roxo", "amarelo", "rosa", "verde"];

const FRASES = [
  "Um passo de cada vez já é progresso.",
  "Pequenas tarefas, grandes conquistas.",
  "Hoje é um bom dia pra riscar algo da lista.",
  "Feito é melhor que perfeito.",
  "Respire fundo. Você está no caminho certo.",
];

const TAREFAS_INICIAIS = [
  { id: 1, titulo: "Reunião de equipe", descricao: "Alinhar prioridades da semana.", status: "Pendente", cor: "azul" },
  { id: 2, titulo: "Trabalhar no branding", descricao: "Ajustar paleta e logotipo.", status: "Pendente", cor: "roxo" },
  { id: 3, titulo: "Relatório do cliente", descricao: "Fechar números do mês.", status: "Pendente", cor: "amarelo" },
  { id: 4, titulo: "Criar planejamento", descricao: "Organizar tarefas da sprint.", status: "Pendente", cor: "rosa" },
  { id: 5, titulo: "Revisar contrato", descricao: "", status: "Concluída", cor: "verde" },
];

function Relogio() {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const horaFormatada = hora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dataFormatada = hora.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="relogio">
      <span className="relogio-hora">{horaFormatada}</span>
      <span className="relogio-data">{dataFormatada}</span>
    </div>
  );
}

function App() {
  const [tarefas, setTarefas] = useState(TAREFAS_INICIAIS);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [frase] = useState(() => FRASES[Math.floor(Math.random() * FRASES.length)]);

  function adicionarTarefa(e) {
    e.preventDefault();
    if (!titulo.trim()) return;

    const cor = PALETA[tarefas.length % PALETA.length];

    setTarefas((prev) => [
      { id: Date.now(), titulo, descricao, status: "Pendente", cor },
      ...prev,
    ]);
    setTitulo("");
    setDescricao("");
    setModalAberto(false);
  }

  function alternarStatus(id) {
    setTarefas((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Pendente" ? "Concluída" : "Pendente" }
          : t
      )
    );
  }

  function excluirTarefa(id) {
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  }

  const pendentes = tarefas.filter((t) => t.status === "Pendente");
  const concluidas = tarefas.filter((t) => t.status === "Concluída");

  return (
    <main className="home">
      <Relogio />

      <div className="topo">
        <div>
          <h1>Organizador de tarefas</h1>
          <p className="frase-motivacional">{frase}</p>
        </div>

        <button className="botao-nova" onClick={() => setModalAberto(true)}>
          Nova tarefa
        </button>
      </div>

      <div className="layout">
        <section className="grid-tarefas">
          {pendentes.length === 0 ? (
            <p className="estado-vazio">Nenhuma tarefa pendente.</p>
          ) : (
            pendentes.map((tarefa) => (
              <CardTarefa
                key={tarefa.id}
                tarefa={tarefa}
                onAlternar={alternarStatus}
                onExcluir={excluirTarefa}
              />
            ))
          )}
        </section>

        <aside className="coluna-concluidas">
          <p className="coluna-titulo">Concluídas</p>
          {concluidas.length === 0 ? (
            <p className="coluna-vazia">Nada por aqui ainda.</p>
          ) : (
            concluidas.map((tarefa) => (
              <div key={tarefa.id} className="item-concluido">
                <button
                  className="checkbox-concluido"
                  onClick={() => alternarStatus(tarefa.id)}
                  aria-label="Reabrir tarefa"
                >
                  ✓
                </button>
                <span className="titulo-concluido">{tarefa.titulo}</span>
                <button
                  className="excluir-concluido"
                  onClick={() => excluirTarefa(tarefa.id)}
                  aria-label="Excluir tarefa"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </aside>
      </div>

      {modalAberto && (
        <div className="modal-fundo" onClick={() => setModalAberto(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-topo">
              <p className="modal-titulo">Nova tarefa</p>
              <button
                className="modal-fechar"
                onClick={() => setModalAberto(false)}
                aria-label="Fechar"
              >
                x
              </button>
            </div>

            <form onSubmit={adicionarTarefa}>
              <input
                type="text"
                placeholder="Título da tarefa"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                autoFocus
              />
              <textarea
                placeholder="Descrição (opcional)"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
              />
              <div className="modal-rodape">
                <button
                  type="button"
                  className="botao-cancelar"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="botao-adicionar">
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function CardTarefa({ tarefa, onAlternar, onExcluir }) {
  return (
    <div className={`card-tarefa cor-${tarefa.cor}`}>
      <div className="card-topo">
        <button
          className="checkbox"
          onClick={() => onAlternar(tarefa.id)}
          aria-label="Marcar como concluída"
        />
        <button
          className="botao-excluir"
          onClick={() => onExcluir(tarefa.id)}
          aria-label="Excluir tarefa"
        >
          x
        </button>
      </div>

      <p className="titulo-tarefa">{tarefa.titulo}</p>
      {tarefa.descricao && <p className="descricao-tarefa">{tarefa.descricao}</p>}
    </div>
  );
}

export default App;