import { createHTML } from "../global-functions";
import { events } from "../pub-sub";
import "./todo-tickets.css"

export const todoTicketSection = createHTML(`
    <div class="todo-ticket-section"></div>
`)

const todoTicketContainer = createHTML(`
    <div class="todo-ticket-container"></div>
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
                <div class="todo-ticket-project">${todoData.project}</div>
            </div>
        </div>
    `)
    setPriorityIcon(todoTicket, todoData)
    setFavoriteIcon(todoTicket, todoData)
    if (todoData.pastDue()) {
        let todoTicketDate = todoTicket.children[0].children[1].children[1]
        todoTicketDate.setAttribute('style', 'color: rgb(168, 0, 0); font-weight: 300')
    }
    const todoCompletedButton = todoTicket.children[0].children[0]//Work this into "Cache HTML" section?
    todoCompletedButton.addEventListener('click', () => {//Work this into "Bind Events" section?
        let ticket = todoCompletedButton.closest('.todo-ticket')
        ticket.classList.add('remove-todo-ticket')
        setTimeout(function() {todoTicketContainer.removeChild(ticket), events.emit('todoTicketDeleted', todoData)}, 500)
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
events.on('displayTodoList', function(todoList) {
    while (todoTicketContainer.hasChildNodes()) {
        todoTicketContainer.removeChild(todoTicketContainer.firstChild)
    }
    todoList.forEach(todo => {
        let todoTicket = createTodoTicket(todo)
        todoTicketContainer.appendChild(todoTicket)
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
        favorite: addTodoFormFavoriteInput.checked,
        project: addTodoFormProjectInput.value.trim()
    }
    events.emit('todoSubmited', newTodoData)
    resetForm()
})

events.on('todoCreated', function(newTodo) {
    let newTodoTicket = createTodoTicket(newTodo)
    todoTicketContainer.appendChild(newTodoTicket)
    resetForm()
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