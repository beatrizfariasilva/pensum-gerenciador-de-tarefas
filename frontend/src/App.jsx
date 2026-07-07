// configurações e constantes 
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "https://teamtask-gerenciador-de-tarefas.onrender.com";

const STATUS = {
  PENDENTE: "Pendente",
  CONCLUIDA: "Concluída",
};

const FILTROS = {
  TODAS: "Listar todas",
  PENDENTES: "Pendentes",
  CONCLUIDAS: "Concluídas",
};

//estados da tela
function App() {
  const [tarefas, setTarefas] = useState([]);
  const [carregandoTarefas, setCarregandoTarefas] = useState(true);
  const [erro, setErro] = useState(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [filtro, setFiltro] = useState(FILTROS.TODAS);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [prioridades, setPrioridades] = useState([]);
  const [carregandoPrioridades, setCarregandoPrioridades] = useState(false);

  // carrega as tarefas assim que a tela abre
  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregandoTarefas(true);
        const resposta = await fetch(`${API_URL}/tarefas`);
        if (!resposta.ok) throw new Error("Falha ao carregar tarefas");
        const dados = await resposta.json();
        setTarefas(dados);
      } catch (err) {
        setErro("Não foi possível carregar as tarefas. Tente recarregar a página.");
      } finally {
        setCarregandoTarefas(false);
      }
    }
    carregarTarefas();
  }, []);

  // fecha o modal ao pressionar "x"
  useEffect(() => {
    if (!modalAberto) return;
    function aoTeclar(event) {
      if (event.key === "Escape") setModalAberto(false);
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [modalAberto]);

  // criação, atualização e exclusão de tarefas
  async function criarTarefa(event) {
    event.preventDefault();
    if (!titulo.trim() || salvando) return;

    const novaTarefa = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      status: STATUS.PENDENTE,
    };

    try {
      setSalvando(true);
      const resposta = await fetch(`${API_URL}/tarefas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaTarefa),
      });
      if (!resposta.ok) throw new Error("Falha ao criar tarefa");

      const tarefaCriada = await resposta.json();
      setTarefas((atual) => [tarefaCriada, ...atual]);
      setTitulo("");
      setDescricao("");
      setModalAberto(false);
    } catch (err) {
      setErro("Não foi possível criar a tarefa. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function alterarStatus(id) {
    const tarefaAtual = tarefas.find((tarefa) => tarefa.id === id);
    if (!tarefaAtual) return;

    const novoStatus =
      tarefaAtual.status === STATUS.CONCLUIDA ? STATUS.PENDENTE : STATUS.CONCLUIDA;

      setTarefas((atual) =>
      atual.map((tarefa) => (tarefa.id === id ? { ...tarefa, status: novoStatus } : tarefa))
    );

    try {
      const resposta = await fetch(`${API_URL}/tarefas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (!resposta.ok) throw new Error("Falha ao atualizar tarefa");
      const tarefaAtualizada = await resposta.json();
      setTarefas((atual) =>
        atual.map((tarefa) => (tarefa.id === id ? tarefaAtualizada : tarefa))
      );
    } catch (err) {
      setTarefas((atual) =>
        atual.map((tarefa) => (tarefa.id === id ? tarefaAtual : tarefa))
      );
      setErro("Não foi possível atualizar o status da tarefa.");
    }
  }

  async function deletarTarefa(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta tarefa?");
    if (!confirmar) return;

    const tarefasAnteriores = tarefas;
    setTarefas((atual) => atual.filter((tarefa) => tarefa.id !== id));

    try {
      const resposta = await fetch(`${API_URL}/tarefas/${id}`, { method: "DELETE" });
      if (!resposta.ok) throw new Error("Falha ao excluir tarefa");
    } catch (err) {
      setTarefas(tarefasAnteriores);
      setErro("Não foi possível excluir a tarefa.");
    }
  }
  // gera sugestões de prioridade usando a API do gemini
  async function gerarPrioridades() {
    try {
      setCarregandoPrioridades(true);
      const resposta = await fetch(`${API_URL}/tarefas/prioridades`);
      if (!resposta.ok) throw new Error("Falha ao gerar prioridades");
      const dados = await resposta.json();
      setPrioridades(dados);
    } catch (err) {
      setErro("Não foi possível gerar a análise de prioridades agora.");
    } finally {
      setCarregandoPrioridades(false);
    }
  }

  // infos calculadas a partir da lista de tarefas
  const tarefasFiltradas = useMemo(() => {
    if (filtro === FILTROS.PENDENTES) {
      return tarefas.filter((tarefa) => tarefa.status === STATUS.PENDENTE);
    }
    if (filtro === FILTROS.CONCLUIDAS) {
      return tarefas.filter((tarefa) => tarefa.status === STATUS.CONCLUIDA);
    }
    return tarefas;
  }, [tarefas, filtro]);

  const totalPendentes = useMemo(
    () => tarefas.filter((tarefa) => tarefa.status === STATUS.PENDENTE).length,
    [tarefas]
  );

  const totalConcluidas = useMemo(
    () => tarefas.filter((tarefa) => tarefa.status === STATUS.CONCLUIDA).length,
    [tarefas]
  );

  // base da estrutura visual 
  return (
    <main className="app">
      <header className="topo">
        <h1>TeamTask.</h1>
      </header>

      {erro && (
        <div className="aviso-erro" role="alert">
          <span>{erro}</span>
          <button onClick={() => setErro(null)} aria-label="Fechar aviso">
            x
          </button>
        </div>
      )}

      <section className="barra-acoes">
        <div className="linha-status">
          <span>{tarefas.length} tarefas</span>
          <span>{totalPendentes} pendentes</span>
          <span>{totalConcluidas} concluídas</span>
        </div>

        <div className="acoes">
          <button className="botao-novo" onClick={() => setModalAberto(true)}>
            + Nova task
          </button>

          <select value={filtro} onChange={(event) => setFiltro(event.target.value)}>
            <option value={FILTROS.TODAS}>Listar todas</option>
            <option value={FILTROS.PENDENTES}>Pendentes</option>
            <option value={FILTROS.CONCLUIDAS}>Concluídas</option>
          </select>
        </div>
      </section>

      <section className="grade">
        {carregandoTarefas ? (
          <div className="vazio">Carregando tarefas...</div>
        ) : (
          <>
            {tarefasFiltradas.map((tarefa) => (
              <article
                className={`pasta ${tarefa.status === STATUS.CONCLUIDA ? "concluida" : ""}`}
                key={tarefa.id}
              >
                <div className="aba" />

                <div className="conteudo-pasta">
                  <div className="etiqueta-arquivo">
                    <div className="campo">
                      <span>Título</span>
                      <strong>{tarefa.titulo}</strong>
                    </div>

                    <div className="campo campo-descricao">
                      <span>Descrição</span>
                      <p>{tarefa.descricao || "Sem descrição."}</p>
                    </div>
                  </div>

                  <div className="botoes-card">
                    <button className="botao-concluir" onClick={() => alterarStatus(tarefa.id)}>
                      {tarefa.status === STATUS.CONCLUIDA
                        ? "Voltar para pendente"
                        : "Marcar como concluída"}
                    </button>

                    <button className="botao-deletar" onClick={() => deletarTarefa(tarefa.id)}>
                      Excluir tarefa
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {tarefasFiltradas.length === 0 && (
              <div className="vazio">Nenhuma tarefa encontrada.</div>
            )}
          </>
        )}
      </section>

      <section className="painel-ia">
        <div className="topo-ia">
          <div>
            <h2>Prioridades sugeridas</h2>
            <p>Análise de prioridade com base nas suas tarefas atuais.</p>
          </div>

          <button
            className="botao-ia"
            onClick={gerarPrioridades}
            disabled={tarefas.length === 0 || carregandoPrioridades}
          >
            {carregandoPrioridades ? "Analisando..." : "Gerar análise"}
          </button>
        </div>

        {prioridades.length > 0 ? (
          <div className="lista-prioridades">
            {prioridades.map((item) => (
              <article className="item-prioridade" key={item.id}>
                <div>
                  <span>{item.prioridade}</span>
                  <h3>{item.titulo}</h3>
                </div>

                <p>{item.motivo}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="ia-vazia">
            Clique em gerar análise para receber sugestão de prioridade com IA.
          </div>
        )}
      </section>

      {modalAberto && (
        <div className="modal" onClick={() => setModalAberto(false)}>
          <form
            className="formulario"
            onSubmit={criarTarefa}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="topo-formulario">
              <h2>Nova tarefa</h2>

              <button type="button" onClick={() => setModalAberto(false)} aria-label="Fechar">
                x
              </button>
            </div>

            <label>
              Título
              <input
                type="text"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
                autoFocus
              />
            </label>

            <label>
              Descrição
              <textarea
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
              />
            </label>

            <button className="salvar" type="submit" disabled={!titulo.trim() || salvando}>
              {salvando ? "Salvando..." : "Criar tarefa"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

export default App;