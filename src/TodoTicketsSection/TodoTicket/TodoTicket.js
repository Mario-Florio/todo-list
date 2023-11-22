import './TodoTicket.css';
import { createHTML } from '../../global-functions';
import { events } from "../../pub-sub";
import TodoTicketSection from '../TodoTicketsSection';

function TodoTicket(todoData) {

    const todoTicket = createHTML(`
        <form class="todo-ticket new-todo-ticket">
            <div style="display: flex; justify-content: space-between; align-items: center">
                <div class="left-container">
                    <input type="radio" class="todo-completed"/>
                    <div>
                        <div style="display: flex">
                            <div class="priority-display">!</div>
                            <div class="favorite-display"></div>
                            <div type="text" class="task">${todoData.task}</div>
                        </div>
                        <div style="display: flex; justify-contents: space-between">
                            <div class="date">${todoData.date}</div>
                            <div class="time" style="margin-left: 5px">${todoData.time}</div>
                        </div>
                    </div>
                </div>
                <div class="right-container">
                    <div class="project">${todoData.project}</div>
                </div>
            </div>
            <div class="favorite-priority-container">
                <div style="display: flex; align-items: center; margin: 10px 0 0 55px">
                    <div style="display: flex; align-items: center">
                        <label for="priority" style="margin-left: 4px">!</label>
                        <input name="priority" type="checkbox" value="important"/>
                    </div>
                    <div style="display: flex; align-items: center">
                        <label class="favorite-label" for="favorite"></label>
                        <input name="favorite" type="checkbox" value="favorite"/>
                    </div>
                </div>
                <div style="margin-top: 10px">
                    <button>Cancel</button>
                    <button>Confirm</button>
                </div>
            </div>
        </form>
    `);

    setPriorityIcon(todoTicket, todoData);
    setFavoriteIcon(todoTicket, todoData);

    todoTicket.id = todoData.id;

    //Cache HTML
    const todoTicketTask = todoTicket.children[0].children[0].children[1].children[0].children[2];
    const todoTicketDate = todoTicket.children[0].children[0].children[1].children[1].children[0];
    const todoTicketTime = todoTicket.children[0].children[0].children[1].children[1].children[1];
    const todoCompletedButton = todoTicket.children[0].children[0].children[0];
    const todoTicketProject = todoTicket.children[0].children[1].children[0];
    const todoTicketFormBox = todoTicket.children[1];
    const todoTicketFavoriteInput = todoTicket.children[1].children[0].children[1].children[1];
    const todoTicketPriorityInput = todoTicket.children[1].children[0].children[0].children[1];
    const todoTicketFormBoxCancelButton = todoTicket.children[1].children[1].children[0];
    const todoTicketFormBoxSubmitButton = todoTicket.children[1].children[1].children[1];

    if (todoData.pastDue()) {
        todoTicketDate.classList.add('date-past-due');
        todoTicketTime.classList.add('time-past-due');
    }

    //Bind Events
    todoTicket.addEventListener('click', (e) => {
        if (
                e.target !== todoCompletedButton &&
                e.target !== todoTicketFormBoxCancelButton &&
                e.target !== todoTicketFormBoxSubmitButton
            ) {
            let editableEls = [
                todoTicketTask,
                todoTicketDate,
                todoTicketTime,
                todoTicketProject,
            ];

            editableEls.forEach(el => {
                el.contentEditable = true;
                el.classList.add('input-active');
            });

            todoTicketTask.dataset.placeholder = 'Edit Task';
            todoTicketDate.dataset.placeholder = 'Edit Date';
            todoTicketTime.dataset.placeholder = 'Edit Time';
            todoTicketProject.dataset.placeholder = 'Edit Project';
            todoTicketFormBox.classList.add('favorite-priority-container-active');
        }
    });

    todoTicketFormBoxCancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        resetForm();
    });

    todoCompletedButton.addEventListener('click', () => {
        todoTicket.classList.add('remove-todo-ticket');
        setTimeout(function() {
            TodoTicketSection.children[0].removeChild(todoTicket); 
            events.emit('todoTicketDeleted', todoData);
        }, 500);
    });

    todoTicketFormBoxSubmitButton.addEventListener('click', (e) => {
        e.preventDefault();

        let editedTodoData = {
            id: todoTicket.id,
            task: todoTicketTask.textContent.trim(),
            date: todoTicketDate.textContent.toLowerCase().trim(),
            time: todoTicketTime.textContent.trim(),
            priority: todoTicketPriorityInput.checked,
            favorite: todoTicketFavoriteInput.checked,
            project: todoTicketProject.textContent.trim(),
            type: 'Update',
        }

        resetForm();
        events.emit('projectSubmitted', editedTodoData.project);
        events.emit('todoSubmitted', editedTodoData);
    });

    events.on('todoDataEdited', function(todoClone) {
        if (todoClone.id === todoTicket.id) {
            todoTicketTask.textContent = todoClone.task;
            todoTicketDate.textContent = todoClone.date;
            todoTicketTime.textContent = todoClone.time;
            todoTicketProject.textContent = todoClone.project;
            setPriorityIcon(todoTicket, todoClone);
            setFavoriteIcon(todoTicket, todoClone);

            if (todoClone.pastDue()) {
                todoTicketDate.classList.add('date-past-due');
                todoTicketTime.classList.add('time-past-due');
            } else {
                todoTicketDate.classList.remove('date-past-due');
                todoTicketTime.classList.remove('time-past-due');
            }
        }
    });

    //Utility Functions
    function resetForm() {

        let editableEls = [
            todoTicketTask,
            todoTicketDate,
            todoTicketTime,
            todoTicketProject,
        ];

        editableEls.forEach(el => {
            el.removeAttribute('data-placeholder', '.input-active');
            el.contentEditable = false;
        });

        todoTicketFormBox.classList.remove('favorite-priority-container-active');
        todoTicketTask.textContent = todoData.task;
        todoTicketDate.textContent = todoData.date;
        todoTicketTime.textContent = todoData.time;
        todoTicketProject.textContent = todoData.project;
        const priorityIconEl = todoTicket.children[0].children[0].children[1].children[0].children[0];

        if (priorityIconEl.classList.contains('priority-display-active')) {
            todoTicketPriorityInput.checked = true;
        } else {
            todoTicketPriorityInput.checked = false;
        }

        const favoriteIconEl = todoTicket.children[0].children[0].children[1].children[0].children[1];

        if (favoriteIconEl.classList.contains('favorite-display-active')) {
            todoTicketFavoriteInput.checked = true;
        } else {
            todoTicketFavoriteInput.checked = false;
        }
    }

    function setPriorityIcon(todoTicket, todo) {

        const priorityIconEl = todoTicket.children[0].children[0].children[1].children[0].children[0];
        const todoTicketPriorityInput = todoTicket.children[1].children[0].children[0].children[1];

        if (todo.priority === true) {
            priorityIconEl.classList.add('priority-display-active');
            todoTicketPriorityInput.checked = true;
        } else {
            priorityIconEl.classList.remove('priority-display-active');
            todoTicketPriorityInput.checked = false;
        }
    }
    
    function setFavoriteIcon(todoTicket, todo) {

        const favoriteIconEl = todoTicket.children[0].children[0].children[1].children[0].children[1];
        const todoTicketFavoriteInput = todoTicket.children[1].children[0].children[1].children[1];

        if (todo.favorite === true) {
            favoriteIconEl.classList.add('favorite-display-active');
            todoTicketFavoriteInput.checked = true;
        } else {
            favoriteIconEl.classList.remove('favorite-display-active');
            todoTicketFavoriteInput.checked = false;
        }
    }

    return todoTicket;
}

export default TodoTicket;
