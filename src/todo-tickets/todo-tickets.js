import { createHTML } from "../global-functions";
import { events } from "../pub-sub";
import { Todo, todoList } from "../todos"
import "./todo-tickets.css"

export const todoTicketsSection = createHTML(`
    <div class="todo-ticket-container"></div>
`)

function createTodoTicket(todo, todoIndex) {
        const todoTicket = createHTML(`
            <div class="todo-ticket">
                <div class="todo-ticket-left-container">
                    <input type="radio" class="todo-completed"/>
                    <div>
                        <div style="display: flex">
                            <div class="todo-ticket-priority">!</div>
                            <div class="todo-ticket-favorite"></div>
                            <div></div>
                            <div class="todo-ticket-task">${todo.task}</div>
                        </div>
                        <div class="todo-ticket-date">${todo.date} ${todo.time}</div>
                    </div>
                </div>
                <div class="todo-ticket-right-container">
                    <div class="todo-ticket-project">Project Name</div>
                </div>
            </div>
        `)
        setPriorityIcon(todoTicket, todo)
        setFavoriteIcon(todoTicket, todo)
        bindTodoCompletedButtonEvent(todoTicket, todoIndex)
        return todoTicket
}

const addTodoFormTicket = createHTML(`
    <div id="add-todo-form-ticket">
        <form class="add-todo-form">
            <fieldset class="add-todo-form-required">
                <input class="add-todo-form-task-input" name="task" type="text" placeholder="Task"/>
                <button class="add-todo-form-button">Add Task</button>
            </fieldset>
            <fieldset class="add-todo-form-optional">
                <input class="add-todo-form-date-input" type="text" name="date" placeholder="Today"/>
                <input class="add-todo-form-time-input" type="text" name="time" placeholder="9:00AM"/>
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
const openFormButton = addTodoFormTicket.children[1]
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
openFormButton.addEventListener('click', () => {
    openFormButton.classList.toggle('open-form-button-pressed')
    addTodoFormRequiredFields.classList.toggle('add-todo-form-required-active')
    addTodoFormTaskInput.focus()
    addTodoFormOptionalFields.classList.toggle('add-todo-form-optional-active')
})

addTodoFormSubmitButton.addEventListener('click', (e) => {
    e.preventDefault()
    const todo = new Todo(addTodoFormTaskInput.value,
        addTodoFormDateInput.value, addTodoFormTimeInput.value)
    getCheckboxValue(todo)
    todoList.push(todo)
    events.emit('todoListChanged', todoList)
    const todoTicket = createTodoTicket(todo, todoList.indexOf(todo))
    todoTicketsSection.insertBefore(todoTicket ,todoTicketsSection.lastChild)
    resetForm()
})

function bindTodoCompletedButtonEvent(todoTicket, todoIndex) {
    todoTicket.classList.add('new-todo-ticket')
    const todoCompletedButton = todoTicket.children[0].children[0]
    todoCompletedButton.addEventListener('click', () => {
        let ticket = todoCompletedButton.closest('.todo-ticket')
        setTimeout(function() { ticket.classList.add('remove-todo-ticket') }, 2500)
        setTimeout(function() { removeTicket(ticket), removeTodo(todoIndex), events.emit('todoListChanged', todoList) }, 3000)
    })
}

//Utility
function getCheckboxValue(todo) {
    if (addTodoFormPriorityInput.checked) {
        todo.setPriority()
    }
    if (addTodoFormFavoriteInput.checked) {
        todo.setFavorite()
    }
}

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

function removeTodo(index) {
    todoList.splice(index, 1)
}

function removeTicket(ticket) {
    todoTicketsSection.removeChild(ticket)
}
