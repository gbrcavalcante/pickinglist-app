// Selecione o elemento HTML com o id "pickinglist" e "get-pickinglist"
const container = document.querySelector("#pickinglist");
const getpickinglist = document.querySelector("#get-pickinglist");

// Adicione um ouvinte de evento para o clique no botão ou tecla "Ctrl + Alt + B"
getpickinglist.addEventListener("click", fetchpickinglists);
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey && e.altKey && e.key === "b") || e.key === "B") {
    fetchpickinglists();
  }
});

// Função para fazer uma requisição fetch quando o botão ou tecla é acionado
function fetchpickinglists() {
  fetch("/get-pickinglists")
    .then((response) => {
      // Verifique se a resposta da requisição é bem-sucedida
      if (!response.ok) {
        throw new Error("Server response error");
      }
      return response.json();
    })
    .then((data) => {
      // Registre os dados recebidos no console e atualize a interface do armazém
      console.log("Received pickinglist:", data);
      updateWarehouseInterface(data);
    })
    .catch((error) => {
      // Registre erros ocorridos durante a requisição
      console.error("Error fetching pickinglist:", error);
    });
}

// Função para atualizar a interface do armazém com os dados recebidos
function updateWarehouseInterface(data) {
  // Limpe o conteúdo do contêiner antes de adicionar novos elementos
  container.innerHTML = "";

  // Itere sobre as listas de seleção recebidas
  data.pickinglists.forEach((list) => {
    const listItems = [];

    // Adicione os itens da lista a um array
    list.items.forEach((item) => {
      listItems.push(item);
    });

    // Crie um elemento HTML para representar a pickinglist
    const pickinglist = document.createElement("div");
    pickinglist.classList.add("card");
    container.appendChild(pickinglist);

    // Crie o cabeçalho da pickinglist
    const header = document.createElement("div");

    // Crie elementos para status, ID, data de envio, loja, vendedor e linha horizontal
    const status = document.createElement("div");
    const classStatus = list.status === "A fazer" ? "secondary" : "warning";
    status.innerHTML = `<p><strong>Status:</strong> <span class="status ${classStatus}">${list.status}</span></p>`;

    const id = document.createElement("div");
    id.innerHTML = `<p><strong>ID: </strong><span class="monospace">${list.id}</span></p>`;

    const sendDate = new Date(list.sendDate);
    const send = document.createElement("div");
    send.innerHTML = `<p><strong>Enviado: </strong>${sendDate.toLocaleDateString(
      "pt-BR"
    )} - ${sendDate.toLocaleTimeString("pt-BR")}</p>`;

    const store = document.createElement("div");
    store.innerHTML = `<p><strong>Loja:</strong> ${list.store}</p>`;

    const username = document.createElement("div");
    username.innerHTML = `<p><strong>Vendedor:</strong> ${list.username}</p>`;

    const hr = document.createElement("hr");

    // Adicione os elementos do cabeçalho à pickinglist
    header.appendChild(status);
    header.appendChild(id);
    header.appendChild(send);
    header.appendChild(store);
    header.appendChild(username);
    header.appendChild(hr);

    pickinglist.appendChild(header);
    header.classList.add("card-header");

    // Crie o corpo da pickinglist
    const body = document.createElement("div");
    const buttonText = list.status === "A fazer" ? "Iniciar" : "Continuar";

    // Crie botões para iniciar e finalizar a lista de separação
    const buttonStart = createButton(buttonText, "btn-secondary");
    const buttonFinish = createButton("Finalizar", "btn-primary");

    pickinglist.appendChild(body);
    body.classList.add("card-body");
    body.appendChild(buttonStart);

    // Crie o rodapé da pickinglist
    const footer = document.createElement("div");
    footer.classList.add("card-footer");
    pickinglist.appendChild(footer);
    const progress = document.createElement("div");
    footer.appendChild(progress);
    const feedback = document.createElement("div");
    footer.appendChild(feedback);

    let startTime;

    // Adicione um ouvinte de evento para o clique no botão de iniciar
    buttonStart.addEventListener("click", () => {
      // Crie elementos HTML para representar a lista de separação
      const bodyTitle = document.createElement("h4");
      bodyTitle.textContent = "Lista de separação";
      bodyTitle.classList.add("gradient");

      const bodyList = document.createElement("div");
      listItems.forEach((item) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");

        const label = document.createElement("label");

        label.textContent = item;

        const checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("checkbox-container");
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);

        bodyList.appendChild(checkboxContainer);
        body.appendChild(bodyTitle);
        body.appendChild(bodyList);
      });
      buttonStart.style.display = "none";

      // Adicione o botão de finalizar e atualize o status da lista de separação
      body.appendChild(buttonFinish);

      if (!list.start) {
        startTime = new Date();
        list.start = startTime;
      }

      startTime = new Date(list.start);
      progress.innerHTML = `<p>Iniciado: ${startTime.toLocaleDateString(
        "pt-BR"
      )} - ${startTime.toLocaleTimeString("pt-BR")}</p>`;

      list.status = "Em andamento";
      status.innerHTML = `<p><strong>Status:</strong> <span class="status warning">${list.status}</span></p>`;
      updatePickinglistStatus(list.id, list.status, list.start, list.finish);
    });

    // Adicione um ouvinte de evento para o clique no botão de finalizar
    buttonFinish.addEventListener("click", () => {
      // Registre o tempo de término e calcule a duração da lista de separação
      const endTime = new Date();

      const timeDiff = endTime - sendDate;

      const durationInMinutes = Math.floor(timeDiff / 60000);
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;

      let durationText;
      if (timeDiff >= 3600000) {
        durationText = `${hours} hora(s) e ${minutes} minuto(s).`;
      } else {
        durationText = `${minutes} minuto(s).`;
      }

      // Atualize o progresso, duração e feedback da lista de separação
      progress.innerHTML += `<p>Finalizado: ${endTime.toLocaleDateString(
        "pt-BR"
      )} - ${endTime.toLocaleTimeString("pt-BR")}</p>`;

      // Adiciona uma classe de estilo se a duração for maior que 3 horas
      if (timeDiff >= 10800000) {
        progress.innerHTML += `<p class="text-danger">Duração: ${durationText}`;
        feedback.innerHTML = `<p class="alert danger"><svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-exclamation-circle"
        viewBox="0 0 16 16"
        >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
        </svg> O prazo estabelecido para a separação foi ultrapassado!</p>`;
      } else {
        progress.innerHTML += `<p>Duração: ${durationText}`;
        feedback.innerHTML = `<p class="alert success"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
        </svg> Concluído com sucesso!</p>`;
      }

      // Atualize o status da lista de separação e esconda o botão de finalizar
      list.status = "Concluído";
      list.finish = endTime;

      status.innerHTML = `<p><strong>Status:</strong> <span class="status success">${list.status}</span></p>`;
      buttonFinish.style.display = "none";
      updatePickinglistStatus(list.id, list.status, list.start, list.finish);
    });
  });
}

// Função para criar um botão com uma classe específica e texto
function createButton(text, myClass) {
  const button = document.createElement("button");
  const tooltip = `${text} processo de separação`;
  button.textContent = text;
  button.type = "button";
  button.setAttribute("aria-label", tooltip);
  button.classList.add("btn");
  button.classList.add("width-100");
  button.classList.add("tooltip-top");
  button.classList.add(myClass);

  return button;
}

// Função para atualizar o status da lista de separação no servidor
function updatePickinglistStatus(id, status, start, finish, duration) {
  // Dados a serem enviados no corpo da requisição
  const updateData = {
    start,
    status,
    finish,
    duration,
  };

  // Faça uma requisição fetch para atualizar o status da lista de separação
  fetch(`/update-pickinglists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  })
    .then(() => {})
    .then((data) => {
      // Registre a atualização bem-sucedida no console
      console.log("Lista de separação atualizada com sucesso:", data);
      // Execute outras ações após a atualização, se necessário
    })
    .catch(handleError); // Lidar com erros durante as requisições
}

// Função para lidar com erros durante as requisições
function handleError(error) {
  console.error("Erro durante a requisição:", error);
  // Adicione aqui o tratamento de erro adequado, se necessário
}
