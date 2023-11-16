const addTaskBtn = document.querySelector('#add-button')
const todoInput = document.querySelector('#todo-input')
const description = document.querySelector('#description')
const userId = document.querySelector('#user-id')

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
        }

    })
})