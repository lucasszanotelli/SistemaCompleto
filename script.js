// Funções de manipulação do localStorage
function carregarTarefas() {
    return JSON.parse(localStorage.getItem("tarefas") || "[]");
}

function salvarTarefas(tarefas) {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Funções do cadastro
let tarefaEditando = null;

function inicializarCadastro() {
    // Checa se estamos no modo edição
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");

    if (editId !== null) {
        const tarefas = carregarTarefas();
        const tarefa = tarefas[editId];
        if (tarefa) {
            document.getElementById("nome").value = tarefa.nome;
            document.getElementById("prioridade").value = tarefa.prioridade;
            document.getElementById("descricao").value = tarefa.descricao;
            document.getElementById("data").value = tarefa.data;

            document.getElementById("tituloPagina").innerText = "Editar Tarefa";
            document.getElementById("btnSubmit").innerText = "Atualizar";
            tarefaEditando = parseInt(editId);
        }
    }

    document.getElementById("form-tarefa").addEventListener("submit", function (e) {
        e.preventDefault();

        const dados = {
            nome: document.getElementById("nome").value.trim(),
            prioridade: document.getElementById("prioridade").value,
            descricao: document.getElementById("descricao").value.trim(),
            data: document.getElementById("data").value
        };

        let tarefas = carregarTarefas();

        if (tarefaEditando !== null) {
            tarefas[tarefaEditando] = dados;
            salvarTarefas(tarefas);
            alert("Tarefa atualizada com sucesso!");
        } else {
            tarefas.push(dados);
            salvarTarefas(tarefas);
            alert("Tarefa cadastrada com sucesso!");
        }

        window.location.href = "listagem.html";
    });
}

// Funções da listagem
let idParaExcluir = null;
let modalExcluir = null;

function inicializarListagem() {
    modalExcluir = new bootstrap.Modal(document.getElementById("modalExcluir"));
    document.getElementById("btnConfirmarExcluir").addEventListener("click", confirmarExclusao);
    carregarTabela();
}

function carregarTabela() {
    const tarefas = carregarTarefas();
    const tbody = document.querySelector("#tabelaTarefas tbody");
    tbody.innerHTML = "";

    tarefas.forEach((tarefa, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${tarefa.nome}</td>
                <td>${tarefa.prioridade}</td>
                <td>${tarefa.descricao}</td>
                <td>${tarefa.data}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editar(${index})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="abrirModalExcluir(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function abrirModalExcluir(index) {
    idParaExcluir = index;
    modalExcluir.show();
}

function confirmarExclusao() {
    if (idParaExcluir === null) return;

    let tarefas = carregarTarefas();
    tarefas.splice(idParaExcluir, 1);
    salvarTarefas(tarefas);
    carregarTabela();
    modalExcluir.hide();
    idParaExcluir = null;
}

function editar(index) {
    window.location.href = `cadastro_tarefas.html?edit=${index}`;
}
