import { formatDistance, addWeeks, addDays, subDays } from 'date-fns'
import { events } from './pub-sub'

let distanceBetweenDatesInRealWords = formatDistance(addWeeks(new Date(), 5), new Date(), { addSuffix: true })

export const todoList = []

export class Todo {
    constructor(task, date, time) {
        this.task = task
        this.date = date
        this.time = time
    }
    setPriority() {
        this.priority = true
    }
    removePriority() {
        delete this.priority
    }
    setFavorite() {
        this.favorite = true
    }
    removeFavorite() {
        delete this.favorite
    }
}

events.on('todoListSelected', function(data) {
    if (data === 'All') {
        events.emit('displayTodoList', todoList)
    }
    if (data === 'Important') {
        let importantTodos = todoList.filter(todo => {
            if (todo.priority) {
                return todo
            }
        })
        events.emit('displayTodoList', importantTodos)
    }
    if (data === 'Favorites') {
        let favoriteTodos = todoList.filter(todo => {
            if (todo.favorite) {
                return todo
            }
        })
        events.emit('displayTodoList', favoriteTodos)
    }
})