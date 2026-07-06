from flask import Flask, jsonify, request
from flask_cors import CORS
from database import supabase
import os
import json
from google import genai

app = Flask(__name__)
CORS(app)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

#rota CREATE: permite criar uma nova tarefa contendo título, descrição e status
@app.route("/tarefas", methods=['POST'])
def create_task():
    requisicao=request.json
    resposta=supabase.table("tarefas").insert(requisicao).execute()
    return jsonify(resposta.data), 201 

#rota READ: permite listar todas as tarefas cadastradas
@app.route("/tarefas", methods=['GET'])
def read_tasks():
    resposta=supabase.table("tarefas").select("*").execute()
    return jsonify(resposta.data), 200

#rota UPDATE: permite atualizar o status de uma tarefa
@app.route("/tarefas/<id>", methods=['PATCH'])
def update_task(id):
    status_atualizado=request.json
    resposta=supabase.table("tarefas").update(status_atualizado).eq("id", id).execute()
    if not resposta.data:
        return jsonify({"erro": "Tarefa não encontrada."}), 404
    return jsonify(resposta.data[0]), 200

#rota DELETE: permite excluir uma tarefa
@app.route("/tarefas/<id>", methods=['DELETE'])
def delete_task(id):
    resposta=supabase.table("tarefas").delete().eq("id", id).execute()
    if not resposta.data:
        return jsonify({"erro": "Tarefa não encontrada."}), 404
    return jsonify({"mensagem": "Tarefa concluída."}), 200

#sugestão de prioridade de tarefas com API do Gemini
@app.route("/tarefas/prioridades", methods=["GET"])
def sugerir_prioridades():
    resposta = supabase.table("tarefas").select("*").execute()
    tarefas = resposta.data

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
    resposta = client.interactions.create(
        model="gemini-3.5-flash",
        input=prompt
    )

    texto = resposta.output_text.strip()
    resultado = json.loads(texto)

    return jsonify(resultado), 200

if __name__=="__main__":
    app.run(debug=True)

