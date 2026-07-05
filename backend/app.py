from flask import Flask, jsonify, request
from flask_cors import CORS
from database import supabase

app = Flask(__name__)
CORS(app)

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
    

if __name__=="__main__":
    app.run(debug=True)

