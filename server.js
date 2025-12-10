const fs = require('fs');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ⬇️ SERVIR ARQUIVOS DA PASTA PUBLIC
app.use(express.static("public"));

/* --------------------- BANCO JSON --------------------- */

function lerDB() {
    const data = fs.readFileSync("db.json", "utf8");
    return JSON.parse(data);
}

function salvarDB(db) {
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
}

/* --------------------- ROTAS API --------------------- */

// Listar todas as tarefas
app.get("/tarefas", (req, res) => {
    const db = lerDB();
    res.json(db.tarefas);
});

// Buscar tarefa por ID
app.get("/tarefas/:id", (req, res) => {
    const db = lerDB();
    const tarefa = db.tarefas.find(t => String(t.id) === req.params.id);

    if (!tarefa) 
        return res.status(404).json({ erro: "Tarefa não encontrada" });

    res.json(tarefa);
});

// Criar tarefa
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

// Atualizar tarefa
app.put("/tarefas/:id", (req, res) => {
    const db = lerDB();
    const tarefa = db.tarefas.find(t => String(t.id) === req.params.id);

    if (!tarefa) 
        return res.status(404).json({ erro: "Tarefa não encontrada" });

    tarefa.nome = req.body.nome ?? tarefa.nome;
    tarefa.prioridade = req.body.prioridade ?? tarefa.prioridade;
    tarefa.descricao = req.body.descricao ?? tarefa.descricao;
    tarefa.data = req.body.data ?? tarefa.data;

    salvarDB(db);

    res.json(tarefa);
});

// Remover
app.delete("/tarefas/:id", (req, res) => {
    const db = lerDB();
    const antes = db.tarefas.length;

    db.tarefas = db.tarefas.filter(t => String(t.id) !== req.params.id);

    if (db.tarefas.length === antes)
        return res.status(404).json({ erro: "Tarefa não encontrada" });

    salvarDB(db);

    res.json({ mensagem: "Tarefa removida" });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor online em http://localhost:${PORT}`);
});
