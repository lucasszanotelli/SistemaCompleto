const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Função para ler JSON
function lerDB() {
    const data = fs.readFileSync("db.json", "utf8");
    return JSON.parse(data);
}

// Função para salvar JSON
function salvarDB(db) {
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
}
//listar
app.get("/tarefas", (req, res) => {
    const db = lerDB();
    res.json(db.tarefas);
});

// PEGAR TAREFA POR ID
app.get("/tarefas/:id", (req, res) => {
    const db = lerDB();
    const tarefa = db.tarefas.find(t => String(t.id) === String(req.params.id));

    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

    res.json(tarefa);
});

// CADASTRAR TAREFA
app.post("/tarefas", (req, res) => {
    const db = lerDB();

    const nova = {
        id: Date.now(),
        nome: req.body.nome,
        prioridade: req.body.prioridade,
        descricao: req.body.descricao,
        data: req.body.data
    };

    db.tarefas.push(nova);
    salvarDB(db);

    res.status(201).json(nova);
});

// ATUALIZAR TAREFA
app.put("/tarefas/:id", (req, res) => {
    const db = lerDB();
    const tarefa = db.tarefas.find(t => String(t.id) === String(req.params.id));

    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

    tarefa.nome = req.body.nome ?? tarefa.nome;
    tarefa.prioridade = req.body.prioridade ?? tarefa.prioridade;
    tarefa.descricao = req.body.descricao ?? tarefa.descricao;
    tarefa.data = req.body.data ?? tarefa.data;

    salvarDB(db);

    res.json(tarefa);
});

// REMOVER TAREFA
app.delete("/tarefas/:id", (req, res) => {
    const db = lerDB();
    const tamanhoAntes = db.tarefas.length;

    db.tarefas = db.tarefas.filter(t => String(t.id) !== String(req.params.id));

    if (db.tarefas.length === tamanhoAntes)
        return res.status(404).json({ erro: "Tarefa não encontrada" });

    salvarDB(db);

    res.json({ mensagem: "Tarefa removida" });
});

/* --------------- SERVIDOR ---------------- */
app.listen(3000, () => {
    console.log("API rodando em http://localhost:3000/");
});
