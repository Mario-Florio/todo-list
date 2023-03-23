import { createHTML } from "../global-functions";
import { events } from "../pub-sub";
import "./todo-tickets.css"

export const todoTicketSection = createHTML(`
    <div class="todo-ticket-section"></div>
`)

const todoTicketContainer = createHTML(`
    <div class="todo-ticket-container"></div>
`)

const addTodoFormTicket = createHTML(`
    <div id="add-todo-form-ticket">
        <form class="add-todo-form">
            <fieldset class="add-todo-form-required">
                <input class="add-todo-form-task-input" name="task" type="text" placeholder="New Task"/>
                <button class="add-todo-form-button">Add Task</button>
            </fieldset>
            <fieldset class="add-todo-form-optional">
                <input class="add-todo-form-date-input" type="text" name="date" placeholder="Today"/>
                <input class="add-todo-form-time-input" type="text" name="time" placeholder="Time"/>
                <input type="text" name="project" placeholder="Project"/>
                <div style="display: flex; align-items: center">
                    <label for="priority" style="margin-left: 4px">!</label>
                    <input class="add-todo-form-priority-input" name="priority" type="checkbox" value="important"/>
                </div>
                <div style="display: flex; align-items: center">
                    <label class="favorite-label" for="favorite"></label>
                    <input class="add-todo-form-favorite-input" name="favorite" type="checkbox" value="favorite"/>
                </div>
            </fieldset>
        </form>
        <div class="open-form-button-icon">
            <div class="open-form-button-bar1"></div>
            <div class="open-form-button-bar2"></div>
        </div>
    </div>
`)

todoTicketSection.appendChild(todoTicketContainer)
todoTicketSection.appendChild(addTodoFormTicket)

//Cache HTML
//Refactor variables so they are not dependent on each other
const addTodoFormTicketButton = addTodoFormTicket.children[1]
const addTodoForm = addTodoFormTicket.children[0]
const addTodoFormRequiredFields = addTodoFormTicket.children[0].children[0]
const addTodoFormTaskInput = addTodoForm.children[0].children[0]
const addTodoFormSubmitButton = addTodoForm.children[0].children[1]
const addTodoFormOptionalFields = addTodoForm.children[1]
const addTodoFormDateInput = addTodoFormOptionalFields.children[0]
const addTodoFormTimeInput = addTodoFormOptionalFields.children[1]
const addTodoFormProjectInput = addTodoFormOptionalFields.children[2]
const addTodoFormPriorityInput = addTodoFormOptionalFields.children[3].children[1]
const addTodoFormFavoriteInput = addTodoFormOptionalFields.children[4].children[1]

//Bind Events
events.on('setTime', function(nextHour) {
    addTodoFormTimeInput.placeholder = nextHour
})

addTodoFormTicketButton.addEventListener('click', () => {
    addTodoFormTicketButton.classList.toggle('open-form-button-pressed')
    addTodoFormRequiredFields.classList.toggle('add-todo-form-required-active')
    addTodoFormOptionalFields.classList.toggle('add-todo-form-optional-active')
})

addTodoFormSubmitButton.addEventListener('click', (e) => {
    e.preventDefault()
    let newTodoData = {
        task: addTodoFormTaskInput.value.trim(),
        date: addTodoFormDateInput.value.toLowerCase().trim(),
        time: addTodoFormTimeInput.value.trim(),
        priority: addTodoFormPriorityInput.checked,
        favorite: addTodoFormFavoriteInput.checked,
        project: addTodoFormProjectInput.value.trim()
    }
    events.emit('projectSubmitted', addTodoFormProjectInput.value.trim())
    events.emit('todoSubmited', newTodoData)
    resetForm()
})

events.on('todoCreated', function(newTodo) {
    let newTodoTicket = createTodoTicket(newTodo)
    todoTicketContainer.appendChild(newTodoTicket)
    resetForm()
})

events.on('displayTodoList', function(todoList) {
    while (todoTicketContainer.hasChildNodes()) {
        todoTicketContainer.removeChild(todoTicketContainer.firstChild)
    }
    todoList.forEach(todo => {
        let todoTicket = createTodoTicket(todo)
        todoTicketContainer.appendChild(todoTicket)
    })
})

//Utility
function resetForm() {
    addTodoFormTaskInput.value = ''
    addTodoFormDateInput.value = ''
    addTodoFormTimeInput.value = ''
    addTodoFormProjectInput.value = ''
    addTodoFormPriorityInput.checked = false
    addTodoFormFavoriteInput.checked = false
}

//Todo Ticket Module
function createTodoTicket(todoData) {
    const todoTicket = createHTML(`
        <form class="todo-ticket new-todo-ticket">
            <div style="display: flex; justify-content: space-between; align-items: center">
                <div class="todo-ticket-left-container">
                    <input type="radio" class="todo-completed"/>
                    <div>
                        <div style="display: flex">
                            <div class="todo-ticket-priority">!</div>
                            <div class="todo-ticket-favorite"></div>
                            <div type="text" class="todo-ticket-task input-active">${todoData.task}</div>
                        </div>
                        <div style="display: flex; justify-contents: space-between">
                            <div class="todo-ticket-date input-active">${todoData.date}</div>
                            <div class="todo-ticket-time input-active" style="margin-left: 5px">${todoData.time}</div>
                        </div>
                    </div>
                </div>
                <div class="todo-ticket-right-container">
                    <div class="todo-ticket-project input-active">${todoData.project}</div>
                </div>
            </div>
            <div class="form-box">
                    <div style="display: flex; align-items: center; margin: 10px 0 0 55px">
                        <div style="display: flex; align-items: center">
                            <label class="favorite-label" for="favorite"></label>
                            <input class="add-todo-form-favorite-input" name="favorite" type="checkbox" value="favorite"/>
                        </div>
                        <div style="display: flex; align-items: center">
                            <label for="priority" style="margin-left: 4px">!</label>
                            <input class="add-todo-form-priority-input" name="priority" type="checkbox" value="important"/>
                        </div>
                    </div>
                    <div style="margin-top: 10px">
                        <button class="add-todo-form-button">Cancel</button>
                        <button class="add-todo-form-button">Confirm</button>
                    </div>
                </div>
        </form>
    `)
    setPriorityIcon(todoTicket, todoData)
    setFavoriteIcon(todoTicket, todoData)
    if (todoData.pastDue()) {
        let todoTicketDate = todoTicket.children[0].children[1].children[1]
        todoTicketDate.setAttribute('style', 'color: rgb(168, 0, 0); font-weight: 300')
    }

    //Cache HTML
    const todoTicketTask = todoTicket.children[0].children[0].children[1].children[0].children[2]
    const todoTicketDate = todoTicket.children[0].children[0].children[1].children[1].children[0]
    const todoTicketTime = todoTicket.children[0].children[0].children[1].children[1].children[1]
    const todoCompletedButton = todoTicket.children[0].children[0].children[0]
    const todoTicketProject = todoTicket.children[0].children[1].children[0]
    const todoTicketFormBox = todoTicket.children[1]
    const todoTicketFavoriteInput = todoTicket.children[1].children[0].children[0].children[1]
    const todoTicketPriorityInput = todoTicket.children[1].children[0].children[1].children[1]
    const todoTicketFormBoxCancelButton = todoTicket.children[1].children[1].children[0]
    const todoTicketFormBoxSubmitButton = todoTicket.children[1].children[1].children[1]

    //Bind Events
    todoTicket.addEventListener('click', (e) => {
        if (e.target !== todoCompletedButton && e.target !== todoTicketFormBoxCancelButton && e.target !== todoTicketFormBoxSubmitButton) {
            todoTicketTask.contentEditable = true
            todoTicketTask.dataset.placeholder = 'Edit Task'
            todoTicketTask.classList.add('input-active')
            todoTicketDate.contentEditable = true
            todoTicketDate.dataset.placeholder = 'Edit Date'
            todoTicketDate.classList.add('input-active')
            todoTicketTime.contentEditable = true
            todoTicketTime.dataset.placeholder = 'Edit Time'
            todoTicketTime.classList.add('input-active')
            todoTicketProject.contentEditable = true
            todoTicketProject.dataset.placeholder = 'Edit Project'
            todoTicketProject.classList.add('input-active')
            todoTicketFormBox.classList.add('form-box-active')
        }
    })

    todoTicketFormBoxCancelButton.addEventListener('click', (e) => {
        e.preventDefault()
        resetForm()
    })

    todoCompletedButton.addEventListener('click', () => {
        todoTicket.classList.add('remove-todo-ticket')
        setTimeout(function() {todoTicketContainer.removeChild(todoTicket), events.emit('todoTicketDeleted', todoData)}, 500)
    })

    todoTicketFormBoxSubmitButton.addEventListener('click', (e) => {
        e.preventDefault()
        let editedTodoData = {
            id: todoData.id,
            task: todoTicketTask.textContent.trim(),
            date: todoTicketDate.textContent.toLowerCase().trim(),
            time: todoTicketTime.textContent.trim(),
            priority: todoTicketPriorityInput.checked,
            favorite: todoTicketFavoriteInput.checked,
            project: todoTicketProject.textContent.trim()
        }
        resetForm()
        console.log(editedTodoData)
    })

    //Utility Functions
    function resetForm() {
        todoTicketFormBox.classList.remove('form-box-active')
        todoTicketTask.contentEditable = false
        todoTicketTask.dataset.placeholder = ''
        todoTicketTask.textContent = todoData.task
        todoTicketTask.classList.remove('input-active')
        todoTicketDate.contentEditable = false
        todoTicketDate.dataset.placeholder = ''
        todoTicketDate.classList.remove('input-active')
        todoTicketTime.contentEditable = false
        todoTicketTime.dataset.placeholder = ''
        todoTicketTime.classList.remove('input-active')
        todoTicketProject.contentEditable = false
        todoTicketProject.dataset.placeholder = ''
        todoTicketProject.textContent = todoData.project
        todoTicketProject.classList.remove('input-active')
        todoTicketPriorityInput.checked = false
        todoTicketFavoriteInput.checked = false
    }

    function setPriorityIcon(todoTicket, todo) {
        const priorityIconEl = todoTicket.children[0].children[0].children[1].children[0].children[0]
        if (todo.priority === true) {
            priorityIconEl.classList.add('todo-ticket-priority-active')
        }
    }
    
    function setFavoriteIcon(todoTicket, todo) {
        const favoriteIconEl = todoTicket.children[0].children[0].children[1].children[0].children[1]
        if (todo.favorite === true) {
            favoriteIconEl.classList.add('todo-ticket-favorite-active')
        }
    }

    return todoTicket
}
