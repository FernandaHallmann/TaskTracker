const socket = new SockJS('http://localhost:8080/home', {
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }
});

const stompClient = Stomp.over(socket);
let tasks = [];
let users = [];
let habits = [];

stompClient.connect({}, (frame) => {
    console.log('Connected: ' + frame);

    stompClient.subscribe('/topic/tarefas', (message) => {
        const newTask = JSON.parse(message.body);

        if (Array.isArray(newTask)) {
            newTask.forEach(savedTask => {
                const existingTaskIndex = tasks.findIndex(task => task.id === savedTask.id);
                if (existingTaskIndex >= 0) {
                    tasks[existingTaskIndex] = savedTask;
                } else {
                    tasks.push(savedTask);
                }
            });
        } else {
            const existingTaskIndex = tasks.findIndex(task => task.id === newTask.id);
            if (existingTaskIndex >= 0) {
                tasks[existingTaskIndex] = newTask;
            } else {
                tasks.push(newTask);
            }
        }

        renderTaskList();
    });

    stompClient.subscribe('/topic/usuarios', (message) => {
        const newUser = JSON.parse(message.body);

        if (Array.isArray(newUser)) {
            users = newUser;
        } else {
            const existingUserIndex = users.findIndex(user => user.id === newUser.id);
            if (existingUserIndex >= 0) {
                users[existingUserIndex] = newUser;
            } else {
                users.push(newUser);
            }
        }

        renderUserList();
    });

    stompClient.subscribe('/topic/habitos', (message) => {
        const newHabit = JSON.parse(message.body);

        if (Array.isArray(newHabit)) {
            habits = newHabit;
        } else {
            const existingHabitIndex = habits.findIndex(habit => habit.id === newHabit.id);
            if (existingHabitIndex >= 0) {
                habits[existingHabitIndex] = newHabit; 
            } else {
                habits.push(newHabit); 
            }
        }

        renderHabits(); 
    });

    stompClient.send('/app/tarefas/listar-todos', {}, {});
    stompClient.send('/app/usuarios/listar-todos', {}, {});
    stompClient.send('/app/habitos/listar-todos', {}, {});
});

function renderTaskList() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const row = document.createElement('tr');

        const descricaoCell = document.createElement('td');
        descricaoCell.textContent = task.descricao;
        row.appendChild(descricaoCell);

        const dataInicioCell = document.createElement('td');
        dataInicioCell.textContent = task.dataInicio;
        row.appendChild(dataInicioCell);

        const dataLimiteCell = document.createElement('td');
        dataLimiteCell.textContent = task.dataLimite;
        row.appendChild(dataLimiteCell);

        const concluidoCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.concluido;
        checkbox.disabled = true; 
        concluidoCell.appendChild(checkbox);
        row.appendChild(concluidoCell);

        const actionCell = document.createElement('td');
        if (!task.concluido) {
            const concluirBtn = document.createElement('button');
            concluirBtn.textContent = "Concluir";
            concluirBtn.className = "btn btn-success btn-sm";
            concluirBtn.onclick = () => concluirTarefa(task.id);
            actionCell.appendChild(concluirBtn);
        }
        row.appendChild(actionCell);

        taskList.appendChild(row);
    });
}

function concluirTarefa(tarefaId) {
    stompClient.send('/app/tarefas/concluir', {}, tarefaId.toString());
}

document.getElementById('add-task-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const startDate = new Date(document.getElementById('start-date').value).toISOString();
    const endDate = new Date(document.getElementById('end-date').value).toISOString();
    const user = document.getElementById('user').value;

    const newTask = {
        descricao: description,
        dataInicio: startDate,
        dataLimite: endDate,
        concluido: false,
        usuarioId: user
    };

    stompClient.send('/app/tarefas/criar', {}, JSON.stringify(newTask));

    document.getElementById('add-task-form').reset();
});

// Funções para hábitos e usuários
function renderHabits() {
    const habitList = document.getElementById('habit-list');
    habitList.innerHTML = '';

    habits.forEach(habit => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${habit.descricao}</td>
            <td>${habit.usuarioId}</td>
        `;
        habitList.appendChild(row);
    });
}

document.getElementById('add-habit-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const habitDescription = document.getElementById('habit-description').value;
    const habitUserId = document.getElementById('habit-user').value;

    const habit = {
        descricao: habitDescription,
        usuarioId: habitUserId
    };

    stompClient.send('/app/habitos/criar', {}, JSON.stringify(habit));

    document.getElementById('add-habit-form').reset();
});

function renderUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>${user.senha}</td>
        `;
        userList.appendChild(row);
    });
}

document.getElementById('add-user-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const userName = document.getElementById('user-name').value;
    const userEmail = document.getElementById('user-email').value;
    const userPassword = document.getElementById('user-password').value;

    const newUser = {
        nome: userName,
        email: userEmail,
        senha: userPassword
    };

    stompClient.send('/app/usuarios/criar', {}, JSON.stringify(newUser));

    document.getElementById('add-user-form').reset();
});
