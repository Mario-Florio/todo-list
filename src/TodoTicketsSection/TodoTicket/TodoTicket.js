import './TodoTicket.css';
import { createHTML } from '../../global-functions';
import { events } from "../../pub-sub";
import TodoTicketSection from '../TodoTicketsSection';

function TodoTicket(todoData) {

    const todoTicket = createHTML(`
        <li class="todo-ticket new-todo-ticket">
            <input type="radio" class="todo-completed"/>
            <div class="content"></div>
        </li>
    `);

    const topContainer = createHTML(`
        <div class="top-container">
            <div class="left-container">
                <div class="align-inline" style="border-bottom: .2px solid rgba(69, 69, 69, 0.252)">
                    <div class="priority-display">!</div>
                    <div class="favorite-display"></div>
                    <div type="text" class="task">${todoData.task}</div>
                </div>
                <div style="display: flex; justify-contents: space-between">
                    <div class="date">${todoData.date}</div>
                    <div class="time" style="margin-left: 5px">${todoData.time}</div>
                </div>
            </div>
            <div class="right-container">
                <div class="project">${todoData.project}</div>
            </div>
        </div>
    `);

    const bottomContainer = createHTML(`
        <form class="bottom-container">
            <fieldset class="priority-favorite-container">
                <div class="align-inline">
                    <label for="priority" style="margin-left: 4px">!</label>
                    <input name="priority" type="checkbox" value="important"/>
                </div>
                <div class="align-inline">
                    <label class="favorite-label" for="favorite"></label>
                    <input name="favorite" type="checkbox" value="favorite"/>
                </div>
            </fieldset>
            <div class="align-inline">
                <button>Cancel</button>
                <button>Confirm</button>
            </div>
        </form>
    `);

    todoTicket.children[1].append(topContainer, bottomContainer);

    //Cache HTML
    const todoTicketTask = topContainer.children[0].children[0].children[2];
    const todoTicketDate = topContainer.children[0].children[1].children[0];
    const todoTicketTime = topContainer.children[0].children[1].children[1];
    const todoCompletedButton = todoTicket.children[0];
    const todoTicketProject = topContainer.children[1].children[0];
    const favoriteIconEl = topContainer.children[0].children[0].children[1];
    const todoTicketFavoriteInput = bottomContainer.children[0].children[1].children[1];
    const priorityIconEl = topContainer.children[0].children[0].children[0];
    const todoTicketPriorityInput = bottomContainer.children[0].children[0].children[1];
    const todoTicketCancelButton = bottomContainer.children[1].children[0];
    const todoTicketSubmitButton = bottomContainer.children[1].children[1];

    setPriorityIcon(todoData);
    setFavoriteIcon(todoData);

    if (todoData.pastDue()) {
        todoTicketDate.classList.add('date-past-due');
        todoTicketTime.classList.add('time-past-due');
    }

    //Bind Events
    todoTicket.addEventListener('click', (e) => {
        if (
                e.target !== todoCompletedButton &&
                e.target !== todoTicketCancelButton &&
                e.target !== todoTicketSubmitButton
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
            bottomContainer.classList.add('bottom-container-active');
        }
    });

    todoTicketCancelButton.addEventListener('click', (e) => {
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

    todoTicketSubmitButton.addEventListener('click', (e) => {
        e.preventDefault();

        let editedTodoData = {
            id: todoData.id,
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
        if (todoClone.id === todoData.id) {
            todoData = todoClone;
            todoTicketTask.textContent = todoData.task;
            todoTicketDate.textContent = todoData.date;
            todoTicketTime.textContent = todoData.time;
            todoTicketProject.textContent = todoData.project;
            setPriorityIcon(todoData);
            setFavoriteIcon(todoData);

            if (todoData.pastDue()) {
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
            el.removeAttribute('data-placeholder');
            el.classList.remove('input-active');
            el.contentEditable = false;
        });

        bottomContainer.classList.remove('bottom-container-active');
        todoTicketTask.textContent = todoData.task;
        todoTicketDate.textContent = todoData.date;
        todoTicketTime.textContent = todoData.time;
        todoTicketProject.textContent = todoData.project;

        if (priorityIconEl.classList.contains('priority-display-active')) {
            todoTicketPriorityInput.checked = true;
        } else {
            todoTicketPriorityInput.checked = false;
        }

        if (favoriteIconEl.classList.contains('favorite-display-active')) {
            todoTicketFavoriteInput.checked = true;
        } else {
            todoTicketFavoriteInput.checked = false;
        }
    }

    function setPriorityIcon(todo) {

        if (todo.priority === true) {
            priorityIconEl.classList.add('priority-display-active');
            todoTicketPriorityInput.checked = true;
        } else {
            priorityIconEl.classList.remove('priority-display-active');
            todoTicketPriorityInput.checked = false;
        }
    }
    
    function setFavoriteIcon(todo) {

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
