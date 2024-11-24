document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('#board');

    // Charger les tâches sauvegardées
    loadTasks();

    // Ajouter une tâche
    board.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-task')) {
            const column = e.target.closest('.column');
            const taskText = prompt("Entrez la description de la tâche :");
            if (taskText) {
                createTask(column.querySelector('.task-list'), taskText);
                saveTasks();
            }
        }
    });

    // Drag-and-Drop des tâches
    board.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('task')) {
            e.dataTransfer.setData('text/plain', e.target.id);
        }
    });

    board.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    board.addEventListener('drop', (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        const task = document.getElementById(taskId);
        const taskList = e.target.closest('.task-list');
        if (taskList) {
            taskList.appendChild(task);
            saveTasks();
        }
    });

    // Créer une tâche
    function createTask(container, text) {
        const task = document.createElement('div');
        task.classList.add('task');
        task.textContent = text;
        task.draggable = true;
        task.id = `task-${Date.now()}`;
        container.appendChild(task);
    }

    // Sauvegarder les tâches dans LocalStorage
    function saveTasks() {
        const columns = document.querySelectorAll('.column');
        const tasks = {};
        columns.forEach(column => {
            const status = column.dataset.status;
            const taskList = column.querySelectorAll('.task');
            tasks[status] = Array.from(taskList).map(task => task.textContent);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Charger les tâches depuis LocalStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
        for (const [status, taskList] of Object.entries(tasks)) {
            const column = document.querySelector(`.column[data-status="${status}"] .task-list`);
            taskList.forEach(taskText => createTask(column, taskText));
        }
    }
});
