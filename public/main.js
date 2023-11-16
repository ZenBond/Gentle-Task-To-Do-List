const addTaskBtn = document.querySelector('#add-task')
const loginPopup = document.querySelector('#login-popup')
const taskContainer = document.querySelector('#task-container')
const taskList = document.querySelector('#task-list')
const loginButton = document.querySelector('#login-button')
const usernameDisplay = document.querySelector('#username-display')
const taskInput = document.querySelector('#task-input')
const descriptionInput = document.querySelector('#description-input')
let userId;


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

            userId = loginData.data[0].id

            usernameDisplay.textContent = `User: ${loginData.data[0].username}`
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

//build the todotable based off event listeners
function buildTaskTable(userTasks) {
    taskList.innerHTML = '';

    
    const table = document.createElement('table');
    table.border = '1';
    
    const headerRow = document.createElement('tr');
    const titleHeader = document.createElement('th');
    titleHeader.textContent = 'Title';
    headerRow.appendChild(titleHeader);
    const descriptionHeader = document.createElement('th');
    descriptionHeader.textContent = 'Description';
    headerRow.appendChild(descriptionHeader);
    const dateCreated = document.createElement('th');
    dateCreated.textContent = 'Date Created';
    headerRow.append(dateCreated);
    const status = document.createElement('th');
    status.textContent = 'status';
    headerRow.append(status);
    table.appendChild(headerRow);
    
    userTasks.forEach(task => {
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
                statusSpan.textContent = "Complete"
            } else {
                statusSpan.textContent = "Not Complete"
            }
        })
        const statusSpan = document.createElement('span');
        statusSpan.textContent = task.completed ? "Complete" : "Not Complete";
        statusCell.append(checkbox, statusSpan);
        row.append(statusCell);
        table.append(row)

        const editCell = document.createElement('td');
        const editButton = document.createElement('button');
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
                $.ajax({
                    url: `http://localhost:3000/api/tasks/${task.id}`,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        title: titleInput.value,
                        description: descriptionInput.value,
                        id: task.id
                    }),
                    success: () => {
                        $.ajax({
                            url: `http://localhost:3000/api/users/${userId}`,
                            method: 'GET',
                            success: function(userTasks) {
                                console.log(userTasks)
                                buildTaskTable(userTasks)
                            }
                        })  
                    }
                })

            })
        })
        editCell.append(editButton);
        row.append(editCell);

        table.appendChild(row);

        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            $.ajax({
                url: `http://localhost:3000/api/tasks/${task.id}`,
                method: 'DELETE',
                success: () => {
                    table.removeChild(row)
                }
            })
        })
        deleteCell.append(deleteButton);
        row.append(deleteCell);

        table.appendChild(row);
        
    });

    taskList.append(table)

}



//create task funcitonality
addTaskBtn.addEventListener('click', (e) => {
    
    const data = {
        title: taskInput.value,
        description: descriptionInput.value,
        user_id: userId
    }
    $.ajax({
        url: `http://localhost:3000/api/tasks`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(newTask) {
            console.log(data)
            $.ajax({
                url: `http://localhost:3000/api/users/${userId}`,
                method: 'GET',
                success: function(userTasks) {
                    console.log(userTasks)
                    buildTaskTable(userTasks)
                }
            })  
        }

    })
})

//time conversion
function formatCreatedAt(isoDateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',};
    return new Date(isoDateString).toLocaleString('en-US', options);
  }