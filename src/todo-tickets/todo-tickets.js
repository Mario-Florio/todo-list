import { createHTML } from "../global-functions";
import { events } from "../pub-sub";
import "./todo-tickets.css"

export const todoTicketsSection = createHTML(`
    <div class="todo-ticket-container"><div>
`)

function createTodoTicket(todoData) {//Refactor?
    const todoTicket = createHTML(`
        <div class="todo-ticket new-todo-ticket">
            <div class="todo-ticket-left-container">
                <input type="radio" class="todo-completed"/>
                <div>
                    <div style="display: flex">
                        <div class="todo-ticket-priority">!</div>
                        <div class="todo-ticket-favorite"></div>
                        <div class="todo-ticket-task">${todoData.task}</div>
                    </div>
                    <div class="todo-ticket-date">${todoData.date} ${todoData.time}</div>
                </div>
            </div>
            <div class="todo-ticket-right-container">
                <div class="todo-ticket-project">Project Name</div>
            </div>
        </div>
    `)
    setPriorityIcon(todoTicket, todoData)
    setFavoriteIcon(todoTicket, todoData)
    const todoCompletedButton = todoTicket.children[0].children[0]//Work this into "Cache HTML" section
    todoCompletedButton.addEventListener('click', () => {//Work this into "Bind Events" section
        let ticket = todoCompletedButton.closest('.todo-ticket')
        ticket.classList.add('remove-todo-ticket')
        setTimeout(function() {todoTicketsSection.removeChild(ticket), events.emit('todoTicketDeleted', todoData)}, 500)
        })
    return todoTicket
}

export const addTodoFormTicket = createHTML(`
    <div id="add-todo-form-ticket">
        <form class="add-todo-form">
            <fieldset class="add-todo-form-required">
                <input class="add-todo-form-task-input" name="task" type="text" placeholder="Task"/>
                <button class="add-todo-form-button">Add Task</button>
            </fieldset>
            <fieldset class="add-todo-form-optional">
                <input class="add-todo-form-date-input" type="text" name="date" placeholder="Today"/>
                <input class="add-todo-form-time-input" type="text" name="time" placeholder="Time"/>
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

todoTicketsSection.appendChild(addTodoFormTicket)

//Cache HTML
const addTodoFormTicketButton = addTodoFormTicket.children[1]
const addTodoForm = addTodoFormTicket.children[0]
const addTodoFormRequiredFields = addTodoFormTicket.children[0].children[0]
const addTodoFormTaskInput = addTodoForm.children[0].children[0]
const addTodoFormSubmitButton = addTodoForm.children[0].children[1]
const addTodoFormOptionalFields = addTodoForm.children[1]
const addTodoFormDateInput = addTodoFormOptionalFields.children[0]
const addTodoFormTimeInput = addTodoFormOptionalFields.children[1]
const addTodoFormPriorityInput = addTodoFormOptionalFields.children[2].children[1]
const addTodoFormFavoriteInput = addTodoFormOptionalFields.children[3].children[1]

//Bind Events
events.on('displayTodoList', function(todoList) {//Refactor?
    while (todoTicketsSection.children.length > 1) {
        todoTicketsSection.removeChild(todoTicketsSection.firstChild)
    }
    todoList.forEach(todo => {
        let todoTicket = createTodoTicket(todo)
        todoTicketsSection.insertBefore(todoTicket ,todoTicketsSection.lastChild)
    })
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
        favorite: addTodoFormFavoriteInput.checked
    }
    events.emit('todoSubmited', newTodoData)
    resetForm()
})

events.on('todoCreated', function(newTodo) {
    let newTodoTicket = createTodoTicket(newTodo)
    todoTicketsSection.insertBefore(newTodoTicket ,todoTicketsSection.lastChild)
    resetForm()
})

//Utility
function resetForm() {
    addTodoFormTaskInput.value = ''
    addTodoFormDateInput.value = ''
    addTodoFormTimeInput.value = ''
    addTodoFormPriorityInput.checked = false
    addTodoFormFavoriteInput.checked = false
}

function setPriorityIcon(todoTicket, todo) {
    const priorityIconEl = todoTicket.children[0].children[1].children[0].children[0]
    if (todo.priority === true) {
        priorityIconEl.classList.add('todo-ticket-priority-active')
    }
}

function setFavoriteIcon(todoTicket, todo) {
    const favoriteIconEl = todoTicket.children[0].children[1].children[0].children[1]
    if (todo.favorite === true) {
        favoriteIconEl.classList.add('todo-ticket-favorite-active')
    }
}