// Seleciona o elemento HTML com o ID "pickinglist-history" e o armazena em pickinglistHistory
const pickinglistHistory = document.querySelector("#pickinglist-history");

// Seleciona o elemento HTML com o ID "btn-update" e o armazena em btnUpdate
const btnUpdate = document.querySelector("#btn-update");

// Adiciona um ouvinte de evento de clique ao botão com o ID "btn-update", que chama a função getAllPickinglists quando clicado
btnUpdate.addEventListener("click", getAllPickinglists);

// Adiciona um ouvinte de evento de tecla ao documento
document.addEventListener("keydown", (e) => {
  // Verifica se as teclas Ctrl, Alt e A (ou a) estão pressionadas simultaneamente
  if (e.ctrlKey && e.altKey && (e.key === "a" || e.key === "A")) {
    // Chama a função getAllPickinglists se as condições acima forem atendidas
    getAllPickinglists();
  }
});

// Função responsável por obter todas as listas de picking
function getAllPickinglists() {
  // Realiza uma solicitação fetch para a rota "/get-all-pickinglists" no servidor
  fetch("/get-all-pickinglists")
    .then((response) => {
      // Verifica se a resposta do servidor é bem-sucedida (código 2xx)
      if (!response.ok) {
        throw new Error("Server response error");
      }
      // Converte a resposta para JSON
      return response.json();
    })
    .then((data) => {
      // Exibe no console os dados recebidos do servidor
      console.log("Received pickinglist:", data);
      // Chama a função createElement para manipular os dados recebidos
      createElement(data);
    })
    .catch((error) => {
      // Registra no console se ocorrer algum erro durante a solicitação fetch
      console.error("Error fetching pickinglist:", error);
    });
}

function createElement(data) {
  // Limpa o conteúdo atual de pickinglistHistory
  pickinglistHistory.innerHTML = "";

  // Para cada picking list no array de picking lists
  data.pickinglists.forEach((list) => {
    // Cria um array para armazenar os itens da lista
    const listItems = [];

    // Adiciona cada item da lista ao array listItems
    list.items.forEach((item) => {
      listItems.push(item);
    });

    // Cria um elemento de div para representar uma picking list
    const element = document.createElement("div");
    element.classList.add("card");

    // Cria um elemento de div para representar o cabeçalho da picking list
    const header = document.createElement("div");
    header.classList.add("card-header");

    // Obtém a classe de status com base no status da lista
    const statusClass = getStatusClass(list.status);

    // Preenche o cabeçalho com informações da picking list
    header.innerHTML = `<p><strong>Status:</strong> <span class="status ${statusClass}">${list.status}</span></p>`;
    header.innerHTML += `<p><strong>ID:</strong> <span class="monospace">${list.id}</span></p>`;
    header.innerHTML += `<p><strong>Loja:</strong> ${list.store}</p>`;
    header.innerHTML += `<p><strong>Vendedor:</strong> ${list.username}</p>`;
    const sendDate = new Date(list.sendDate);
    header.innerHTML += `<p><strong>Enviado:</strong> ${sendDate.toLocaleDateString(
      "pt-BR"
    )} - ${sendDate.toLocaleTimeString("pt-BR")}`;

    // Adiciona informações de início se disponíveis
    if (list.start !== "") {
      const start = new Date(list.start);
      header.innerHTML += `<p><strong>Iniciado:</strong> ${start.toLocaleDateString(
        "pt-BR"
      )} - ${start.toLocaleTimeString("pt-BR")}</p>`;
    }

    // Adiciona informações de conclusão se disponíveis
    if (list.finish !== "") {
      const finish = new Date(list.finish);
      header.innerHTML += `<p><strong>Finalizado:</strong> ${finish.toLocaleDateString(
        "pt-BR"
      )} - ${finish.toLocaleTimeString("pt-BR")}</p>`;

      // Calcula a diferença de tempo entre envio e conclusão
      const timeDiff = finish - sendDate;

      // Converte a diferença de tempo para minutos e calcula horas e minutos
      const durationInMinutes = Math.floor(timeDiff / 60000);
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;

      // Cria uma representação legível da duração e adiciona ao cabeçalho
      let durationText;
      if (timeDiff >= 3600000) {
        durationText = `${hours} hora(s) e ${minutes} minuto(s).`;
      } else {
        durationText = `${minutes} minuto(s).`;
      }

      // Cria um elemento de parágrafo para exibir a duração
      const durationElement = document.createElement("p");
      durationElement.innerHTML = `<strong>Duração:</strong> ${durationText}`;

      // Adiciona uma classe de estilo se a duração for maior que 3 horas
      if (timeDiff >= 10800000) {
        durationElement.classList.add("text-danger");
      }

      // Adiciona o elemento de duração ao cabeçalho
      header.appendChild(durationElement);
    }

    // Cria um elemento de div para representar o corpo da picking list
    const body = document.createElement("div");

    // Cria um contêiner para envolver o botão de controle de visibilidade
    const container = document.createElement("div");
    container.classList.add("width-100");

    // Cria um botão para controlar a visibilidade dos itens da lista
    const button = createBtn();
    container.appendChild(button);
    body.appendChild(container);

    // Cria uma lista não ordenada para exibir os itens da lista
    const ul = document.createElement("ul");
    body.appendChild(ul);
    ul.classList.add("ul-body");
    ul.style.display = "none";
    body.classList.add("ul-container");

    // Adiciona cada item da lista à lista não ordenada
    listItems.forEach((items) => {
      const item = document.createElement("li");
      item.textContent = items;
      ul.appendChild(item);
    });

    // Adiciona um ouvinte de evento ao botão para alternar a visibilidade da lista
    button.addEventListener("click", () => {
      if (ul.style.display === "none") {
        ul.style.display = "flex";
        button.setAttribute("aria-label", "Ocultar");
        button.querySelector("svg").style.transform = `rotate(0deg) scaleY(-1)`;
      } else if (ul.style.display === "flex") {
        ul.style.display = "none";
        button.setAttribute("aria-label", "Mostrar");
        button.querySelector(
          "svg"
        ).style.transform = `rotate(180deg) scaleY(-1)`;
      }
    });

    // Adiciona o cabeçalho, o corpo e a picking list completa a pickinglistHistory
    element.appendChild(header);
    element.appendChild(body);
    pickinglistHistory.appendChild(element);
  });
}

/**
 * Retorna a classe de estilo correspondente a um determinado status.
 * @param {string} status - O status a ser avaliado.
 * @returns {string} - A classe de estilo correspondente ao status.
 */
function getStatusClass(status) {
  // Verifica se o status é "A fazer" e retorna a classe "secondary"
  if (status === "A fazer") {
    return "secondary";
  }
  // Verifica se o status é "Em andamento" e retorna a classe "warning"
  else if (status === "Em andamento") {
    return "warning";
  }
  // Se o status não for nenhum dos anteriores, retorna a classe "success"
  else {
    return "success";
  }
}

/**
 * Cria e retorna um botão com um ícone e um texto.
 * @returns {HTMLButtonElement} - Elemento de botão criado.
 */
function createBtn() {
  // Cria os elementos HTML necessários
  const button = document.createElement("button");
  const text = document.createElement("span");
  const icon = document.createElement("span");

  // Adiciona texto ao elemento de texto e aplica uma classe de estilo
  text.textContent = "Lista de separação";

  // Adiciona um ícone SVG ao elemento de ícone e aplica uma transformação para inverter a direção
  icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
  </svg>`;
  icon.style.transform = "rotate(180deg) scaleY(-1)";

  // Configurações adicionais para o botão
  button.type = "button";
  button.appendChild(text);
  button.appendChild(icon);
  button.setAttribute("aria-label", "Mostrar"); // Corrigi o atributo 'aria-label'
  button.classList.add("tooltip-top");
  button.classList.add("btn-list");

  // Retorna o botão criado
  return button;
}
