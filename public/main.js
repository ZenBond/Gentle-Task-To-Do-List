const addTaskBtn = document.querySelector('#add-task')
const loginPopup = document.querySelector('#login-popup')
const taskContainer = document.querySelector('#task-container')
const taskList = document.querySelector('#task-list')
const loginButton = document.querySelector('#login-button')


hideTasks()

//hide and display functions for todolists
const showLoginPopup = () => {
    loginPopup.style.display = 'block'
}

const hideLoginPopup = () => {
    loginPopup.style.display = 'none'
}

const showTasks = () => {
    taskContainer.style.display = 'block'
}

function hideTasks() {
    taskContainer.style.display = 'none'
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
            alert(loginData.message);
            hideLoginPopup();
            showTasks();
            console.log(loginData.data[0].id)
            $.ajax({
                url: `http://localhost:3000/api/users/${loginData.data[0].id}`,
                method: 'GET',
                success: function(userTasks) {
                    console.log(userTasks)
                    buildTaskTable(userTasks)
                }
            })
        },
    })
    
})


function buildTaskTable(userTasks) {
    taskList.innerHTML = '';

    const table = document.createElement('table');
    table.border = '1';


}




addTaskBtn.addEventListener('click', (e) => {
    const data = {
        title: todoInput.value,
        description: description.value,
        userId: userId.value
    }
    $.ajax({
        url: `http://localhost:3000/api/tasks`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            console.log(data)

            updateTodoList(data)
        }

    })
})

function updateTodoList(task) {
    const listItem = document.createElement('li');
    let content = `Title: ${task.title}\n`;

    if (task.description !== '') {
        content += `Description: ${task.description}\n`;
    }

    content += `User ID: ${task.userId}`;
    listItem.textContent = content;

    toDoList.appendChild(listItem);
}