import { createHTML } from "../global-functions";
import { events } from "../pub-sub";
import "./todo-tickets.css"

const todoTicketSectionModule = (function() {

    const todoTicketSection = createHTML(`
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
        events.emit('todoSubmitted', newTodoData)
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

    return {
        todoTicketSection,
        todoTicketContainer
    }

})()

export {
    todoTicketSectionModule
}

//Todo Ticket Module
const createTodoTicket = function(todoData) {

    const todoTicket = createHTML(`
        <form class="todo-ticket new-todo-ticket">
            <div style="display: flex; justify-content: space-between; align-items: center">
                <div class="todo-ticket-left-container">
                    <input type="radio" class="todo-completed"/>
                    <div>
                        <div style="display: flex">
                            <div class="todo-ticket-priority">!</div>
                            <div class="todo-ticket-favorite"></div>
                            <div type="text" class="todo-ticket-task">${todoData.task}</div>
                        </div>
                        <div style="display: flex; justify-contents: space-between">
                            <div class="todo-ticket-date">${todoData.date}</div>
                            <div class="todo-ticket-time" style="margin-left: 5px">${todoData.time}</div>
                        </div>
                    </div>
                </div>
                <div class="todo-ticket-right-container">
                    <div class="todo-ticket-project">${todoData.project}</div>
                </div>
            </div>
            <div class="form-box">
                <div style="display: flex; align-items: center; margin: 10px 0 0 55px">
                    <div style="display: flex; align-items: center">
                        <label for="priority" style="margin-left: 4px">!</label>
                        <input class="add-todo-form-priority-input" name="priority" type="checkbox" value="important"/>
                    </div>
                    <div style="display: flex; align-items: center">
                        <label class="favorite-label" for="favorite"></label>
                        <input class="add-todo-form-favorite-input" name="favorite" type="checkbox" value="favorite"/>
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
        let todoTicketDate = todoTicket.children[0].children[0].children[1].children[1].children[0]
        let todoTicketTime = todoTicket.children[0].children[0].children[1].children[1].children[1]
        todoTicketDate.classList.add('date-past-due')
        todoTicketTime.classList.add('time-past-due')
    }
    todoTicket.id = todoData.id

    //Cache HTML
    const todoTicketTask = todoTicket.children[0].children[0].children[1].children[0].children[2]
    const todoTicketDate = todoTicket.children[0].children[0].children[1].children[1].children[0]
    const todoTicketTime = todoTicket.children[0].children[0].children[1].children[1].children[1]
    const todoCompletedButton = todoTicket.children[0].children[0].children[0]
    const todoTicketProject = todoTicket.children[0].children[1].children[0]
    const todoTicketFormBox = todoTicket.children[1]
    const todoTicketFavoriteInput = todoTicket.children[1].children[0].children[1].children[1]
    const todoTicketPriorityInput = todoTicket.children[1].children[0].children[0].children[1]
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
            console.log(todoData.id)
        }
    })

    todoTicketFormBoxCancelButton.addEventListener('click', (e) => {
        e.preventDefault()
        resetForm()
    })

    todoCompletedButton.addEventListener('click', () => {
        todoTicket.classList.add('remove-todo-ticket')
        setTimeout(function() {todoTicketSectionModule.todoTicketContainer.removeChild(todoTicket), events.emit('todoTicketDeleted', todoData)}, 500)
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
        //Delete Todo from old project
        events.emit('projectSubmitted', editedTodoData.project)
        events.emit('todoEdited', editedTodoData)
    })

    events.on('todoDataEdited', function(todoClone) {
        if (todoClone.id === todoTicket.id) {
            todoTicketTask.textContent = todoClone.task
            todoTicketDate.textContent = todoClone.date
            todoTicketTime.textContent = todoClone.time
            todoTicketProject.textContent = todoClone.project
            setPriorityIcon(todoTicket, todoClone)
            setFavoriteIcon(todoTicket, todoClone)
            if (todoClone.pastDue()) {
                todoTicketDate.classList.add('date-past-due')
                todoTicketTime.classList.add('time-past-due')
            } else {
                todoTicketDate.classList.remove('date-past-due')
                todoTicketTime.classList.remove('time-past-due')
            }
        }
    })

    //Utility Functions
    function resetForm() {
        todoTicketFormBox.classList.remove('form-box-active')
        todoTicketTask.contentEditable = false
        todoTicketTask.removeAttribute('data-placeholder')
        todoTicketTask.textContent = todoData.task
        todoTicketTask.classList.remove('input-active')
        todoTicketDate.contentEditable = false
        todoTicketDate.removeAttribute('data-placeholder')
        todoTicketDate.textContent = todoData.date
        todoTicketDate.classList.remove('input-active')
        todoTicketTime.contentEditable = false
        todoTicketTime.removeAttribute('data-placeholder')
        todoTicketTime.textContent = todoData.time
        todoTicketTime.classList.remove('input-active')
        todoTicketProject.contentEditable = false
        todoTicketProject.removeAttribute('data-placeholder')
        todoTicketProject.textContent = todoData.project
        todoTicketProject.classList.remove('input-active')
        const priorityIconEl = todoTicket.children[0].children[0].children[1].children[0].children[0]
        if (priorityIconEl.classList.contains('todo-ticket-priority-active')) {
            todoTicketPriorityInput.checked = true
        } else {
            todoTicketPriorityInput.checked = false
        }
        const favoriteIconEl = todoTicket.children[0].children[0].children[1].children[0].children[1]
        if (favoriteIconEl.classList.contains('todo-ticket-favorite-active')) {
            todoTicketFavoriteInput.checked = true
        } else {
            todoTicketFavoriteInput.checked = false
        }
    }

    function setPriorityIcon(todoTicket, todo) {
        const priorityIconEl = todoTicket.children[0].children[0].children[1].children[0].children[0]
        const todoTicketPriorityInput = todoTicket.children[1].children[0].children[0].children[1]
        if (todo.priority === true) {
            priorityIconEl.classList.add('todo-ticket-priority-active')
            todoTicketPriorityInput.checked = true
        } else {
            priorityIconEl.classList.remove('todo-ticket-priority-active')
            todoTicketPriorityInput.checked = false
        }
    }
    
    function setFavoriteIcon(todoTicket, todo) {
        const favoriteIconEl = todoTicket.children[0].children[0].children[1].children[0].children[1]
        const todoTicketFavoriteInput = todoTicket.children[1].children[0].children[1].children[1]
        if (todo.favorite === true) {
            favoriteIconEl.classList.add('todo-ticket-favorite-active')
            todoTicketFavoriteInput.checked = true
        } else {
            favoriteIconEl.classList.remove('todo-ticket-favorite-active')
            todoTicketFavoriteInput.checked = false
        }
    }

    return todoTicket
}
