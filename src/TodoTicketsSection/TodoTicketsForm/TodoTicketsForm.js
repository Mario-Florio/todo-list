import './TodoTicketsForm.css';
import { createHTML } from '../../global-functions';
import events from '../../pub-sub';

function TodoTicketsForm() {

    const todoTicketsForm = createHTML(`
        <div id="todo-ticket-form-container">
            <form>
                <fieldset class="main">
                    <label class="hide" for="task">Task</label>
                    <input name="task" id="task" type="text" placeholder="New Task"/>
                    <button>Add Task</button>
                </fieldset>
                <fieldset class="optional">
                    <label class="hide" for="date">Date</label>
                    <input type="text" name="date" id="date" placeholder="Today"/>
                    <label class="hide" for="time">Time</label>
                    <input type="text" name="time" id="time" placeholder="Time"/>
                    <label class="hide" for="project">Project</label>
                    <input type="text" name="project" id="project" placeholder="Project"/>
                    <div class="align-inline">
                        <label for="priority" style="margin-left: 4px">!</label>
                        <input name="priority" id="priority" type="checkbox" value="important"/>
                    </div>
                    <div class="align-inline">
                        <label class="favorite-label" for="favorite"></label>
                        <input name="favorite" id="favorite" type="checkbox" value="favorite"/>
                    </div>
                </fieldset>
            </form>
            <button>
                <div class="bar1"></div>
                <div class="bar2"></div>
            </button>
        </div>
    `);

    //Cache HTML
    const todoTicketsFormButton = todoTicketsForm.children[1];
    const addTodoFormRequiredFields = todoTicketsForm.children[0].children[0];
    const addTodoFormTaskInput = todoTicketsForm.children[0].children[0].children[1];
    const addTodoFormSubmitButton = todoTicketsForm.children[0].children[0].children[2];
    const addTodoFormOptionalFields = todoTicketsForm.children[0].children[1];
    const addTodoFormDateInput = todoTicketsForm.children[0].children[1].children[1];
    const addTodoFormTimeInput = todoTicketsForm.children[0].children[1].children[3];
    const addTodoFormProjectInput = todoTicketsForm.children[0].children[1].children[5];
    const addTodoFormPriorityInput = todoTicketsForm.children[0].children[1].children[6].children[1];
    const addTodoFormFavoriteInput = todoTicketsForm.children[0].children[1].children[7].children[1];

    //Bind Events
    events.on('setTime', function(nextHour) {
        addTodoFormTimeInput.placeholder = nextHour;
    });

    todoTicketsFormButton.addEventListener('click', () => {
        todoTicketsFormButton.classList.toggle('active');
        addTodoFormRequiredFields.classList.toggle('main-active');
        addTodoFormOptionalFields.classList.toggle('optional-active');
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
            type: 'Create',
        }

        events.emit('projectSubmitted', newTodoData.project);
        events.emit('todoSubmitted', newTodoData);

        resetForm();
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

    return todoTicketsForm;
}

export default TodoTicketsForm;
