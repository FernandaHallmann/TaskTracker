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
        console.log("Mensagem recebida do backend (usuários):", message.body);
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
        row.className = "border-b";

        const descricaoCell = document.createElement('td');
        descricaoCell.className = "px-4 py-2";
        descricaoCell.textContent = task.descricao;
        row.appendChild(descricaoCell);

        const dataInicioCell = document.createElement('td');
        dataInicioCell.className = "px-4 py-2";
        dataInicioCell.textContent = task.dataInicio;
        row.appendChild(dataInicioCell);

        const dataLimiteCell = document.createElement('td');
        dataLimiteCell.className = "px-4 py-2";
        dataLimiteCell.textContent = task.dataLimite;
        row.appendChild(dataLimiteCell);

        const concluidoCell = document.createElement('td');
        concluidoCell.className = "px-4 py-2";
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.concluido;
        checkbox.disabled = true; 
        concluidoCell.appendChild(checkbox);
        row.appendChild(concluidoCell);

        const actionCell = document.createElement('td');
        actionCell.className = "px-4 py-2";
        if (!task.concluido) {
            const concluirBtn = document.createElement('button');
            concluirBtn.textContent = "Concluir";
            concluirBtn.className = "bg-green-600 text-white p-2 rounded-md hover:bg-green-700";
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

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`${section}-section`).classList.remove('hidden');
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

function renderHabits() {
    const habitList = document.getElementById('habit-list');
    habitList.innerHTML = '';

    habits.forEach(habit => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2 border">${habit.descricao}</td>
            <td class="px-4 py-2 border">${habit.usuarioId}</td>
        `;
        habitList.appendChild(row);
    });
}

function renderUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.className = "border-b";

        const nameCell = document.createElement('td');
        nameCell.className = "px-4 py-2";
        nameCell.textContent = user.nome;
        row.appendChild(nameCell);

        const emailCell = document.createElement('td');
        emailCell.className = "px-4 py-2";
        emailCell.textContent = user.email;
        row.appendChild(emailCell);

        const senhaCell = document.createElement('td');
        senhaCell.className = "px-4 py-2";
        senhaCell.textContent = user.senha;
        row.appendChild(senhaCell);

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
