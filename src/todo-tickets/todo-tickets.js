import { createHTML } from "../global-functions";
import "./todo-tickets.css"

export const todoTicketsSection = createHTML(`
    <div class="todo-ticket-container"></div>
`)

class ToDo {
    constructor(task) {
        this.task = task
    }
}

let toDo1 = new ToDo('Shower')
let toDo2 = new ToDo('Eat')
let toDo3 = new ToDo('Sleep')
let toDo4 = new ToDo('Wake up')

let toDos = []

toDos.push(toDo1, toDo2, toDo3, toDo4)

appendTodoTickets()

function appendTodoTickets() {
    for (let i = 0; i < toDos.length; i++) {
        const todoTicket = createHTML(`
            <div class="todo-ticket">
                <div class="todo-ticket-left-container">
                    <input type="radio"/>
                    <div>
                        <div>${toDos[i].task}</div>
                        <div class="todo-ticket-date">Monday 10:00AM</div>
                    </div>
                </div>
                <div class="todo-ticket-right-container">
                    <div class="todo-ticket-project">Project Name</div>
                </div>
            </div>
        `)
        todoTicketsSection.appendChild(todoTicket)
    }
}
