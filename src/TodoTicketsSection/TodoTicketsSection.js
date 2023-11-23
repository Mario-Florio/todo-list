import "./TodoTicketsSection.css";
import { createHTML } from "../global-functions";
import events from "../pub-sub";
import TodoTicketsForm from "./TodoTicketsForm/TodoTicketsForm";
import TodoTicket from "./TodoTicket/TodoTicket";

const TodoTicketsSection = (function() {

    const todoTicketsSection = createHTML(`
        <section class="todo-ticket-section">
            <ul class="todo-ticket-container"></ul>
        </section>
    `);

    const todoTicketsForm = TodoTicketsForm();

    todoTicketsSection.appendChild(todoTicketsForm);

    // Cache HTML
    const todoTicketsContainer = todoTicketsSection.children[0];

    // Bind Events
    events.on('todoCreated', function(newTodo) {
        let newTodoTicket = TodoTicket(newTodo);
        todoTicketsContainer.appendChild(newTodoTicket);
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

    return todoTicketsSection;
})();

export default TodoTicketsSection;
