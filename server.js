// Importar módulos necessários
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

// Criar uma instância do aplicativo Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analisar o corpo das solicitações como JSON
app.use(bodyParser.json());

// Configurar o diretório público
app.use(express.static("public"));

// Array temporário para armazenar listas de separação
const pickinglistsArray = [];

// Rota para criar uma nova lista de separação
app.post("/create-pickinglist", (req, res) => {
  try {
    // Extrair dados da solicitação
    const { username, store, items, status, sendDate } = req.body;

    // Criar um objeto representando a lista de separação
    const newpickinglist = {
      id: uuidv4(),
      username,
      store,
      items,
      status,
      sendDate,
      start: "",
      finish: "",
    };

    // Adicionar a nova lista de separação ao array
    pickinglistsArray.push(newpickinglist);

    // Responder com sucesso e os detalhes da nova lista de separação
    res.json({ success: true, pickinglist: newpickinglist });
  } catch (error) {
    console.error("Erro ao criar a lista de separação:", error);
    // Responder com erro em caso de falha na criação da lista de separação
    res
      .status(500)
      .json({ success: false, error: "Erro ao criar a lista de separação" });
  }
});

// Rota para obter listas de separação em andamento ou a fazer
app.get("/get-pickinglists", (req, res) => {
  try {
    // Filtrar listas de separação com status "Em andamento" ou "A fazer"
    const filteredPickinglists = pickinglistsArray.filter(
      (list) => list.status === "Em andamento" || list.status === "A fazer"
    );

    // Responder com sucesso e as listas de separação filtradas
    res.json({ success: true, pickinglists: filteredPickinglists });
  } catch (error) {
    console.error("Erro ao obter as listas de separação:", error);
    // Responder com erro em caso de falha na obtenção das listas de separação
    res
      .status(500)
      .json({ success: false, error: "Erro ao obter as listas de separação" });
  }
});

// Rota para obter todas as listas de separação
app.get("/get-all-pickinglists", (req, res) => {
  try {
    // Responder com sucesso e todas as listas de separação
    res.json({ success: true, pickinglists: pickinglistsArray });
  } catch (error) {
    console.error("Erro ao obter as listas de separação:", error);
    // Responder com erro em caso de falha na obtenção das listas de separação
    res
      .status(500)
      .json({ success: false, error: "Erro ao obter as listas de separação" });
  }
});

// Rota para atualizar a lista de separação
app.put("/update-pickinglists/:id", (req, res) => {
  try {
    // Extrair dados da solicitação
    const { id } = req.params;
    const { start, finish, status, time } = req.body;

    // Encontrar a lista de separação no array pelo ID
    const picklistToUpdate = pickinglistsArray.find(
      (picklist) => picklist.id === id
    );

    // Verificar se a lista de separação foi encontrada
    if (!picklistToUpdate) {
      return res
        .status(404)
        .json({ success: false, error: "Lista de separação não encontrada" });
    }

    // Atualizar os detalhes da lista de separação
    picklistToUpdate.start = start;
    picklistToUpdate.finish = finish;
    picklistToUpdate.status = status;

    // Responder com sucesso e os detalhes atualizados da lista de separação
    res.json({ success: true, picklist: picklistToUpdate });
  } catch (error) {
    console.error("Erro ao atualizar a lista de separação:", error);
    // Responder com erro em caso de falha na atualização da lista de separação
    res.status(500).json({
      success: false,
      error: "Erro ao atualizar a lista de separação",
    });
  }
});

// Iniciar o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
