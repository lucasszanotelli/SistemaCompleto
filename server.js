const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ------- SERVIR ARQUIVOS FRONT-END -------
app.use(express.static(path.join(__dirname, "public")));

// --------- CONEXÃO COM MONGO DB ----------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro ao conectar MongoDB:", err));

// --------- DEFININDO O MODELO -------------
const Tarefa = mongoose.model(
  "Tarefa",
  new mongoose.Schema({
    nome: String,
    prioridade: String,
    descricao: String,
    data: String,
  })
);

// -------- ROTAS DA API ---------

// LISTAR TAREFAS
app.get("/tarefas", async (req, res) => {
  const tarefas = await Tarefa.find();
  res.json(tarefas);
});

// PEGAR TAREFA POR ID
app.get("/tarefas/:id", async (req, res) => {
  const tarefa = await Tarefa.findById(req.params.id);
  if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });
  res.json(tarefa);
});

// CADASTRAR
app.post("/tarefas", async (req, res) => {
  const nova = await Tarefa.create(req.body);
  res.status(201).json(nova);
});

// ATUALIZAR
app.put("/tarefas/:id", async (req, res) => {
  const tarefa = await Tarefa.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

  res.json(tarefa);
});

// REMOVER
app.delete("/tarefas/:id", async (req, res) => {
  const tarefa = await Tarefa.findByIdAndDelete(req.params.id);

  if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

  res.json({ mensagem: "Tarefa removida" });
});

// ROTA PARA QUALQUER OUTRA — SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --------- INICIAR SERVIDOR --------------
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
