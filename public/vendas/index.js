// Referências aos elementos HTML
const inputItem = document.querySelector("#input-item");
const userName = document.querySelector("#name");
const selectOption = document.querySelector("#store");
const listGroup = document.querySelector("#list-group");
const buttonAdd = document.querySelector("#btn-add");
const buttonSend = document.querySelector("#btn-send");
const alertInput = document.querySelector("#alert-input-item");
const alertInfo = document.querySelector("#alert-input-info");
const alertSend = document.querySelector("#alert-send");
const modal = document.querySelector("#modal");
const modalBtnClose = document.querySelectorAll(".modal-close");
const btnSubmit = document.querySelector("#btn-submit");

// Definição de mensagens e ícones de alerta
const text = {
  input: "O código SETA deve conter 8 digitos",
  info: "Complete as informações necessárias para enviar.",
  danger: "Erro inesperado",
  success: "Pedido enviado com sucesso!",
};

const icon = {
  danger: `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  fill="currentColor"
  class="bi bi-exclamation-circle"
  viewBox="0 0 16 16"
  >
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
  </svg>`,
  success: `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  fill="currentColor"
  class="bi bi-check2-circle"
  viewBox="0 0 16 16"
  >
  <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
  <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
  </svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
  </svg>`,
};

// Mensagens de alerta
const alert = {
  input: `<p class="form-invalid">${icon.danger}${text.input}</p>`,
  info: `<p class="form-invalid">${icon.danger} ${text.info}`,
  danger: `<p class="alert danger">${icon.danger} ${text.danger}`,
  success: `<p class="alert success">${icon.success} ${text.success}`,
};

// Adiciona ouvinte de evento de entrada (input) ao campo 'inputItem'
inputItem.addEventListener("input", () => {
  if (inputItem.value.length > 8) {
    alertInput.innerHTML = alert.input;
    inputItem.classList.add("form-invalid-border");
    buttonAdd.disabled = true;
  } else {
    alertInput.innerHTML = "";
    inputItem.classList.remove("form-invalid-border");
    buttonAdd.disabled = false;
  }
});

// Adiciona ouvinte de evento de pressionar tecla (keypress) ao campo 'inputItem'
inputItem.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    if (inputItem.value.length === 8) {
      addItemToList();
    } else {
      alertInput.innerHTML = alert.input;
      inputItem.classList.add("form-invalid-border");
      buttonAdd.disabled = true;
      inputItem.focus();
    }
  }
});

// Adiciona ouvinte de evento de clique (click) ao botão 'buttonAdd'
buttonAdd.addEventListener("click", () => {
  if (inputItem.value !== "" && inputItem.value.length === 8) {
    addItemToList();
  } else {
    alertInput.innerHTML = alert.input;
    inputItem.classList.add("form-invalid-border");
    buttonAdd.disabled = true;
    inputItem.focus();
  }
});

// Evento de entrada de dados no campo 'userName'
userName.addEventListener("input", () => {
  if (userName.value !== "" && selectOption.value !== "") {
    userName.classList.remove("form-invalid-border");
    selectOption.classList.remove("form-invalid-border");
    alertInfo.innerHTML = "";
  } else {
    userName.classList.remove("form-invalid-border");
  }
});

// Adiciona evento de mudança ao seletor de loja
selectOption.addEventListener("change", () => {
  if (userName.value !== "" && selectOption.value !== "") {
    userName.classList.remove("form-invalid-border");
    selectOption.classList.remove("form-invalid-border");
    alertInfo.innerHTML = "";
  } else {
    selectOption.classList.remove("form-invalid-border");
  }
});

// Adiciona um novo item à lista de coleta se o código SETA fornecido for válido.
function addItemToList() {
  if (inputItem.value !== "" && inputItem.value.length === 8) {
    const li = document.createElement("li");
    li.innerHTML = inputItem.value;
    listGroup.appendChild(li);
    li.classList.add("list-items");
    createDeleteButton(li);
    inputItem.value = "";
    inputItem.focus();
    checkAndDisableButton();
    alertInput.innerHTML = "";
    inputItem.classList.remove("form-invalid");
    alertSend.innerHTML = "";
  }
}

// Cria e anexa um botão de exclusão a um item na lista de coleta.
function createDeleteButton(li) {
  const buttonRemove = document.createElement("button");
  buttonRemove.setAttribute("type", "button");
  buttonRemove.setAttribute("aria-label", "Apagar");
  buttonRemove.classList.add("btn-remove");
  buttonRemove.classList.add("tooltip-right");
  buttonRemove.innerHTML += icon.trash;

  // Adiciona um ouvinte de eventos ao botão
  buttonRemove.addEventListener("click", () =>
    removeParentElement(buttonRemove)
  );

  // Anexa o botão de exclusão como filho do elemento <li>
  li.appendChild(buttonRemove);
}

// Adiciona evento de clique no botão "Enviar"
function removeParentElement(element) {
  element.parentElement.remove();
  checkAndDisableButton();
}

// Verifica se a lista de coleta está vazia e desabilita o botão "Enviar" se estiver vazia.
function checkAndDisableButton() {
  const listItems = listGroup.getElementsByTagName("li");

  if (listItems.length === 0) {
    buttonSend.disabled = true;
  } else {
    buttonSend.disabled = false;
  }
}

// Evento de clique no botão "Enviar"
buttonSend.addEventListener("click", () => {
  validSend();
});

// Evento de envio ao pressionar "ctrl" + "alt" + "E"
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === "e" || e.key === "E")) {
    if (!buttonSend.disabled) {
      validSend();
    }
  }
});

// Adiciona um evento de clique para fechar o modal
modalBtnClose.forEach((element) => {
  element.addEventListener("click", () => {
    modal.style.display = "none";
  });
});

// Evento de clique no botão "Enviar" dentro do modal
btnSubmit.addEventListener("click", () => {
  createPickingList();
});

// Evento para fechar o modal ao pressionar a tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    modal.style.display = "none";
  }
});

// Fução para criar lista de separação
function createPickingList() {
  const date = new Date();
  // Cria um objeto com os detalhes da lista de coleta
  const pickinglist = {
    username: userName.value,
    store: selectOption.value,
    items: Array.from(listGroup.children).map((li) => li.textContent.trim()),
    status: "A fazer",
    sendDate: date.toISOString(),
  };

  // Envia a lista de coleta para o servidor via fetch
  fetch("/create-pickinglist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pickinglist),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro de resposta do servidor: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        // Limpa a lista de coleta
        listGroup.innerHTML = "";
        // Exibe uma mensagem de sucesso
        alertSend.innerHTML = alert.success;
        // Verifica e desabilita o botão "Enviar" se necessário
        checkAndDisableButton();
        // Oculta o modal
        modal.style.display = "none";
        // Limpa o campo de feedback de entrada
        alertInput.innerHTML = "";
        // Remove a marcação de entrada inválida do campo de produto
        inputItem.classList.remove("form-invalid");
        // Coloca o foco no campo de produto
        inputItem.focus();
        userName.value = "";
        selectOption.selectedIndex = 0;
      } else {
        // Exibe uma mensagem de erro
        alertSend.innerHTML = alert.danger;
        // Oculta o modal
        modal.style.display = "none";
        // Coloca o foco no botão "Enviar"
        buttonSend.focus();
      }
    })
    .catch((error) => {
      // Exibe uma mensagem de erro em caso de falha na solicitação
      alertSend.innerHTML = alert.danger;
      // Oculta o modal
      modal.style.display = "none";
      // Coloca o foco no botão "Enviar"
      buttonSend.focus();
    });
}

// Função para validar envio
function validSend() {
  if (selectOption.value !== "" && userName.value !== "") {
    if (modal.style.display !== "flex") {
      modal.style.display = "flex";
      btnSubmit.focus();
    }
  } else {
    alertInfo.innerHTML = alert.info;

    if (selectOption.value === "") {
      selectOption.classList.add("form-invalid-border");
    }
    if (userName.value === "" || userName.value === null) {
      userName.classList.add("form-invalid-border");
    }
  }
}
