// Seleciona os elementos do DOM relacionados à navegação entre as visualizações
const btnHome = document.querySelector("#btn-home");
const home = document.querySelector("#home");

const btnHistory = document.querySelector("#btn-history");
const history = document.querySelector("#history");
history.style.display = "none"; // Inicialmente, oculta a visualização de histórico

// Adiciona ouvintes de evento aos botões de navegação
btnHome.addEventListener("click", () => {
  // Exibe a visualização "home" e oculta a visualização "history"
  showView(home, history);
  // Atualiza a classe de seleção nos botões de navegação
  selectedView(btnHome, btnHistory);
});

btnHistory.addEventListener("click", () => {
  // Exibe a visualização "history" e oculta a visualização "home"
  showView(history, home);
  // Atualiza a classe de seleção nos botões de navegação
  selectedView(btnHistory, btnHome);
});

// Função para exibir uma visualização e ocultar outra
function showView(show, hidden) {
  if (hidden.style.display !== "none") {
    hidden.style.display = "none";
  }

  if (show.style.display !== "flex") {
    show.style.display = "flex";
  }
}

// Função para adicionar/remover a classe "selected-view" aos botões de navegação
function selectedView(elementToAddClass, elementToRemoveClass) {
  if (!elementToAddClass.classList.contains("selected-view")) {
    elementToAddClass.classList.add("selected-view");
  }

  if (elementToRemoveClass.classList.contains("selected-view")) {
    elementToRemoveClass.classList.remove("selected-view");
  }
}

// Adiciona ouvintes de evento de tecla para atalhos de teclado
document.addEventListener("keydown", (e) => {
  // Atalho para exibir a visualização "home" (Ctrl + Alt + P ou P)
  if (e.ctrlKey && e.altKey && (e.key === "p" || e.key === "P")) {
    showView(home, history);
    selectedView(btnHome, btnHistory);
  }
});

document.addEventListener("keydown", (e) => {
  // Atalho para exibir a visualização "history" (Ctrl + Alt + H ou H)
  if (e.ctrlKey && e.altKey && (e.key === "h" || e.key === "H")) {
    showView(history, home);
    selectedView(btnHistory, btnHome);
  }
});
