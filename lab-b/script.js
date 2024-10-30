class Todo {
    constructor() {
        // Inicjalizacja tablicy tasks i pobieranie zadań z Local Storage
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        this.searchTerm = ""; // Pole do wyszukiwania
        this.initialize();
    }

    // Inicjalizacja zdarzeń i wywołanie renderowania zadań
    initialize() {
        this.bindUI();
        this.draw();
    }

    // Metoda odpowiedzialna za przypisanie zdarzeń do elementów
    bindUI() {
        document.getElementById("add-task-btn").addEventListener("click", () => this.addTask());
        document.getElementById("search").addEventListener("input", (e) => this.searchTasks(e));
        document.getElementById("task-list").addEventListener("click", (e) => this.handleListClick(e));
    }

    // Metoda odpowiedzialna za renderowanie zadań
    draw() {
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = ""; // Czyszczenie listy

        this.tasks
            .filter(task => task.name.includes(this.searchTerm))
            .forEach((task, index) => {
                const li = document.createElement("li");
                li.setAttribute("data-index", index);
                // li.setAttribute("class", "list-element")
                li.innerHTML = `
                    <div class="list-element-text" contenteditable=true>${this.highlightText(task.name)}</div>
                    <div class="list-element-date">Deadline: ${this.highlightText(task.deadline)}</div>
                    <!--<button class="list-btn" id="save-btn">Zapisz</button>-->
                    <button class="delete-btn">Usuń</button>
                `;
                taskList.appendChild(li);
            });

        // Aktualizacja Local Storage
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    // Metoda dodająca zadanie
    addTask() {
        const taskName = document.getElementById("new-task").value.trim();
        const taskDeadline = document.getElementById("task-deadline").value;

        if (!this.validateTask(taskName, taskDeadline)) {
            alert("Niepoprawne dane!");
            return;
        }

        this.tasks.push({ name: taskName, deadline: taskDeadline });
        this.clearInputFields();
        this.draw(); // Renderuj ponownie po dodaniu zadania
    }

    // Walidacja zadania
    validateTask(name, deadline) {
        if (name.length < 3 || name.length > 255) return false;
        if (deadline && new Date(deadline) <= new Date()) return false;
        return true;
    }

    // Czyszczenie pól formularza
    clearInputFields() {
        document.getElementById("new-task").value = "";
        document.getElementById("task-deadline").value = "";
    }

    // Usuwanie zadania
    removeTask(index) {
        this.tasks.splice(index, 1);
        this.draw(); // Renderuj ponownie po usunięciu
    }

    // Wyszukiwanie zadań
    searchTasks(e) {
        this.searchTerm = e.target.value.trim();
        this.draw(); // Renderuj ponownie po zmianie wyszukiwania
    }

    // Wyróżnianie wyszukiwanej frazy
    highlightText(text) {   
        if (!this.searchTerm) return text;
        const regex = new RegExp(`(${this.searchTerm})`, "gi");
        return text.replace(regex, "<span class='highlight'>$1</span>");
    }

    // Obsługa kliknięć na elementy listy (edycja i usuwanie)
    handleListClick(e) {
        const target = e.target;
        const index = target.parentElement.getAttribute("data-index");
        // const saveButtonList = document.querySelectorAll(".list-btn#save-btn");

        if (target.classList.contains("delete-btn")) {
            console.log('halo');
            this.removeTask(index); // Usuwanie zadania
        } 
        else if (target.classList.contains("list-element-text")) {
            this.editTaskText(target, index); // Edycja zadania
        }
        else if (target.classList.contains("list-element-date")){
            this.editTaskDate(target, index);
        }

        // saveButtonList[index].style.visibility = "visible";
    }

    // Edycja zadania
    editTaskText(taskElement, index) {
        taskElement.classList.add("editing");

        taskElement.addEventListener("blur", () => {
            taskElement.classList.remove("editing");
            this.tasks[index].name = taskElement.textContent;
            this.draw();
        }, {once: true});
    }

    editTaskDate(target, index){
        const dateChoose = document.createElement("span");
        dateChoose.style = "margin-left: 10px";
        dateChoose.innerHTML = `<input type="date" id="change-date-field">`;
        target.appendChild(dateChoose);
        
        const dateInput = document.getElementById("change-date-field");
        dateInput.addEventListener("blur", () => {
            this.tasks[index].deadline = dateInput.value;;
            this.draw();
        }, {once: true});
    }
}

// Inicjalizacja klasy Todo po załadowaniu DOM
document.addEventListener("DOMContentLoaded", () => {
    new Todo();
});
    