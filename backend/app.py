from flask import Flask, jsonify, request
from flask_cors import CORS
from database import supabase
import os
import json
from google import genai

app = Flask(__name__)
CORS(app)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODELO_GEMINI = "gemini-2.5-flash"

@app.route("/tarefas", methods=["POST"])
def create_task():
    requisicao = request.json

    if not requisicao or not requisicao.get("titulo", "").strip():
        return jsonify({"erro": "O campo 'titulo' é obrigatório."}), 400

    try:
        resposta = supabase.table("tarefas").insert(requisicao).execute()
        if not resposta.data:
            return jsonify({"erro": "Não foi possível criar a tarefa."}), 500
        return jsonify(resposta.data[0]), 201
    except Exception as e:
        return jsonify({"erro": "Erro ao criar tarefa.", "detalhes": str(e)}), 500

@app.route("/tarefas", methods=["GET"])
def read_tasks():
    try:
        resposta = supabase.table("tarefas").select("*").order("id", desc=True).execute()
        return jsonify(resposta.data), 200
    except Exception as e:
        return jsonify({"erro": "Erro ao buscar tarefas.", "detalhes": str(e)}), 500

@app.route("/tarefas/<id>", methods=["PATCH"])
def update_task(id):
    status_atualizado = request.json

    if not status_atualizado:
        return jsonify({"erro": "Nenhum dado enviado para atualização."}), 400

    try:
        resposta = supabase.table("tarefas").update(status_atualizado).eq("id", id).execute()
        if not resposta.data:
            return jsonify({"erro": "Tarefa não encontrada."}), 404
        return jsonify(resposta.data[0]), 200
    except Exception as e:
        return jsonify({"erro": "Erro ao atualizar tarefa.", "detalhes": str(e)}), 500

@app.route("/tarefas/<id>", methods=["DELETE"])
def delete_task(id):
    try:
        resposta = supabase.table("tarefas").delete().eq("id", id).execute()
        if not resposta.data:
            return jsonify({"erro": "Tarefa não encontrada."}), 404
        return jsonify({"mensagem": "Tarefa excluída com sucesso."}), 200
    except Exception as e:
        return jsonify({"erro": "Erro ao excluir tarefa.", "detalhes": str(e)}), 500

@app.route("/tarefas/prioridades", methods=["GET"])
def sugerir_prioridades():
    try:
        resposta = supabase.table("tarefas").select("*").execute()
        tarefas = resposta.data
    except Exception as e:
        return jsonify({"erro": "Erro ao buscar tarefas.", "detalhes": str(e)}), 500

    if not tarefas:
        return jsonify([]), 200

    prompt = f"""
        Analise a lista de tarefas abaixo e sugira uma prioridade para cada uma.

        Regras:
        - Use apenas as prioridades: Alta, Média ou Baixa.
        - Explique o motivo de forma curta.
        - Responda somente em JSON válido.
        - Não use markdown.
        - Não escreva texto antes ou depois do JSON.

        Formato esperado:
        [
        {{
            "id": 1,
            "titulo": "Nome da tarefa",
            "prioridade": "Alta",
            "motivo": "Motivo curto da prioridade."
        }}
        ]

        Tarefas:
        {json.dumps(tarefas, ensure_ascii=False)}
    """

    try:
        resposta_ia = client.models.generate_content(
            model=MODELO_GEMINI,
            contents=prompt,
        )
        texto = resposta_ia.text.strip()
        resultado = json.loads(texto)
        return jsonify(resultado), 200
    except json.JSONDecodeError:
        return jsonify({"erro": "A IA retornou um formato inválido. Tente novamente."}), 502
    except Exception as e:
        return jsonify({"erro": "Erro ao gerar sugestões de prioridade.", "detalhes": str(e)}), 502


if __name__ == "__main__":
    app.run(debug=True)