import "./TodoTicketsSection.css";
import { createHTML } from "../global-functions";
import { events } from "../pub-sub";
import TodoTicket from "./TodoTicket/TodoTicket";

const TodoTicketsSection = (function() {

    const todoTicketsSection = createHTML(`
        <div class="todo-ticket-section"></div>
    `);

    const todoTicketsContainer = createHTML(`
        <div class="todo-ticket-container"></div>
    `);

    const todoTicketsForm = createHTML(`
        <div id="todo-ticket-form-container">
            <form>
                <fieldset class="main">
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
    `);

    todoTicketsSection.appendChild(todoTicketsContainer);
    todoTicketsSection.appendChild(todoTicketsForm);

    //Cache HTML
    const todoTicketsFormButton = todoTicketsForm.children[1];
    const addTodoForm = todoTicketsForm.children[0];
    const addTodoFormRequiredFields = todoTicketsForm.children[0].children[0];
    const addTodoFormTaskInput = addTodoForm.children[0].children[0];
    const addTodoFormSubmitButton = addTodoForm.children[0].children[1];
    const addTodoFormOptionalFields = addTodoForm.children[1];
    const addTodoFormDateInput = addTodoFormOptionalFields.children[0];
    const addTodoFormTimeInput = addTodoFormOptionalFields.children[1];
    const addTodoFormProjectInput = addTodoFormOptionalFields.children[2];
    const addTodoFormPriorityInput = addTodoFormOptionalFields.children[3].children[1];
    const addTodoFormFavoriteInput = addTodoFormOptionalFields.children[4].children[1];

    //Bind Events
    events.on('setTime', function(nextHour) {
        addTodoFormTimeInput.placeholder = nextHour;
    });

    todoTicketsFormButton.addEventListener('click', () => {
        todoTicketsFormButton.classList.toggle('open-form-button-pressed');
        addTodoFormRequiredFields.classList.toggle('main-active');
        addTodoFormOptionalFields.classList.toggle('add-todo-form-optional-active');
    });

    addTodoFormSubmitButton.addEventListener('click', (e) => {
        e.preventDefault();

        let newTodoData = {
            task: addTodoFormTaskInput.value.trim(),
            date: addTodoFormDateInput.value.toLowerCase().trim(),
            time: addTodoFormTimeInput.value.trim(),
            priority: addTodoFormPriorityInput.checked,
            favorite: addTodoFormFavoriteInput.checked,
            project: addTodoFormProjectInput.value.trim(),
            type: 'Create'
        }

        events.emit('projectSubmitted', newTodoData.project);
        events.emit('todoSubmitted', newTodoData);

        resetForm();
    });

    events.on('todoCreated', function(newTodo) {
        let newTodoTicket = TodoTicket(newTodo);
        todoTicketsContainer.appendChild(newTodoTicket);

        resetForm();
    });

    events.on('displayTodoList', function(todoList) {
        while (todoTicketsContainer.hasChildNodes()) {
            todoTicketsContainer.removeChild(todoTicketsContainer.firstChild);
        }
        todoList.forEach(todo => {
            let todoTicket = TodoTicket(todo);
            todoTicketsContainer.appendChild(todoTicket);
        });
    });

    //Utility
    function resetForm() {
        addTodoFormTaskInput.value = '';
        addTodoFormDateInput.value = '';
        addTodoFormTimeInput.value = '';
        addTodoFormProjectInput.value = '';
        addTodoFormPriorityInput.checked = false;
        addTodoFormFavoriteInput.checked = false;
    }

    return todoTicketsSection;
})();

export default TodoTicketsSection 
