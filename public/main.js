const addTaskBtn = document.querySelector('#add-task')
const loginPopup = document.querySelector('#login-popup')
const taskContainer = document.querySelector('#task-container')
const taskList = document.querySelector('#task-list')
const loginButton = document.querySelector('#login-button')
const registerButton = document.querySelector('#register-button')
const usernameDisplay = document.querySelector('#username-display')
const taskInput = document.querySelector('#task-input')
const descriptionInput = document.querySelector('#description-input')
const startBtn = document.querySelector('#start-button')
const introContainer = document.querySelector('#intro')
let userId;


hideTasks()

startBtn.addEventListener('click', () => {
    if (startBtn.style.display === 'none') {
        startBtn.style.display = 'block'
    }
    if (introContainer.style.display === 'none') {
        introContainer.style.display === 'block'
    }
    showLoginPopup()
    startBtn.style.display = 'none';
    introContainer.style.display = 'none';
})


//hide and display functions for todolists
const showLoginPopup = () => {
    loginPopup.style.display = 'block'
}

const hideLoginPopup = () => {
    loginPopup.style.display = 'none';
    
    
}


const showTasks = () => {
    taskContainer.style.display = 'block'
}

function hideTasks() {
    taskContainer.style.display = 'none';

}

//Authenticates user login and generates table off of user data.
loginButton.addEventListener('click', async () => {
    const username = $('#username').val()
    const password = $('#password').val()
    
    $.ajax({
        url: 'http://localhost:3000/api/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({username, password}),
        success: function(loginData) {
            alert(loginData.loginMessage);
            hideLoginPopup();
            showTasks();
            userId = loginData.data[0].id
            usernameDisplay.textContent = `User: ${loginData.data[0].username}`
            getUserTasks(userId)
        },
    })
    
})

//Registers a new user
registerButton.addEventListener('click', async () => {
    const username = $('#username').val();
    const password = $('#password').val();

    $.ajax({
        url: 'http://localhost:3000/api/users',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password }),
        success: (data) => {
            console.log(data);
            $.when(
                $.ajax({
                    url: 'http://localhost:3000/api/login',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ username, password }),
                })
            ).then(function (loginData) {
                alert(loginData.registerMessage);
                hideLoginPopup();
                showTasks();
                userId = loginData.data[0].id;
                usernameDisplay.textContent = `User: ${loginData.data[0].username}`;
            });
        },
    });
});






//build the todotable based off event listeners
function buildTaskTable(userTasks) {
    taskList.innerHTML = '';

    if (userTasks.length === 0) {
        taskList.innerHTML = ''
        return;
    }

    const headers = ['Title', 'Description', 'Date Created', 'Status', 'Edit', 'Delete'];
    const table = createTableWithHeaders(headers);
    
    userTasks.forEach(task => {
        const taskId = task.id
        const row = document.createElement('tr');
        const titleCell = document.createElement('td');
        titleCell.textContent = task.title;
        row.appendChild(titleCell);
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = task.description;
        row.appendChild(descriptionCell);
        const dateCell = document.createElement('td');
        task.created_at = formatCreatedAt(task.created_at);
        dateCell.textContent = task.created_at;
        row.append(dateCell);
        const statusCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                statusSpan.textContent = "✅"
            } else {
                statusSpan.textContent = "❌"
            }
        })
        const statusSpan = document.createElement('span');
        statusSpan.textContent = task.completed ? "✅" : "❌";
        statusCell.append(checkbox, statusSpan);
        row.append(statusCell);
        table.append(row)

        const editCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.classList.add('edit-button')
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.value = task.title;

            const descriptionInput = document.createElement('textarea');
            descriptionInput.value = task.description;

            titleCell.textContent = '';
            titleCell.appendChild(titleInput);

            descriptionCell.textContent = '';
            descriptionCell.appendChild(descriptionInput);

            editButton.textContent = 'Save';
            editButton.addEventListener('click', () => {
            editUserTasks(taskId, titleInput, descriptionInput);

            })
        })
        editCell.append(editButton);
        row.append(editCell);

        table.appendChild(row);

        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn')
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteUserTasks(taskId, table, row)
        })
        deleteCell.append(deleteButton);
        row.append(deleteCell);

        table.appendChild(row);
        
    });

    taskList.append(table)

}

//create task funcitonality
addTaskBtn.addEventListener('click', () => {
    const data = {
        title: taskInput.value,
        description: descriptionInput.value,
        user_id: userId
    }
    createTask(data);
})

//time conversion
function formatCreatedAt(isoDateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',};
    return new Date(isoDateString).toLocaleString('en-US', options);
  }

//CRUD functions
function getUserTasks(userId) {
    $.ajax({
        url: `http://localhost:3000/api/users/${userId}`,
        method: 'GET',
        success: function(userTasks) {
            buildTaskTable(userTasks)
        }
    })
}


function createTask(data) {
    $.ajax({
        url: `http://localhost:3000/api/tasks`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: () => {
            getUserTasks(userId)
        }

    })
}

function deleteUserTasks(taskId, table, row) {
    $.ajax({
        url: `http://localhost:3000/api/tasks/${taskId}`,
        method: 'DELETE',
        success: () => {
            table.removeChild(row)
        }
    })
}

function editUserTasks(taskId, titleInput, descriptionInput) {
    $.ajax({
        url: `http://localhost:3000/api/tasks/${taskId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            title: titleInput.value,
            description: descriptionInput.value,
            id: taskId
        }),
        success: () => {
           getUserTasks(userId)
        }
    })
}

function createTableWithHeaders(headers) {
    const table = document.createElement('table');
    table.border = '1';

    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });

    table.appendChild(headerRow);
    return table;
}

