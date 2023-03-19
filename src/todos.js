import { format, isToday, endOfHour, addSeconds, isValid } from 'date-fns'
import { events } from './pub-sub'

//const todoList = []

class TodoList {
    all = []
    dueToday() {
        let dueToday = this.all.filter(todo => {
            let todosDate = new Date(todo.date)
            if (isToday(todosDate)) {
                return todo
            }
        })
        dueToday.sort((a, b) => 
            new Date(`${a.date} ${a.time}`) > new Date(`${b.date} ${b.time}`) ? 1 : -1)
        return dueToday
    }
    upcoming() {
        let upcoming = [...todoList.all].sort((a, b) => 
            new Date(`${a.date} ${a.time}`) > new Date(`${b.date} ${b.time}`) ? 1 : -1)
        return upcoming
    }
    important() {
        let importantTodos = todoList.all.filter(todo => {
            if (todo.priority) {
                return todo
            }
        })
        return importantTodos
    }
    favorites() {
        let favoriteTodos = todoList.all.filter(todo => {
            if (todo.favorite) {
                return todo
            }
        })
        return favoriteTodos
    }
}

const todoList = new TodoList

export class Todo {
    constructor(task, date, time, id) {
        this.task = task
        this.date = date
        this.time = time
        this.id = id
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

//Bind Events
window.addEventListener('load', () => {
    let todaysDate = format(new Date(), 'd')
    events.emit('setDate', todaysDate)
})

events.on('todoSubmited', function(newTodoData) {//Sanitize Input
    newTodoData.id = new Date() //Date serves as unique Id
    if (newTodoData.date === '') {
        newTodoData.date = format(new Date(), 'M/d/yyyy')
    }
    if (newTodoData.time === '') {
        let nearestHour = format(addSeconds(endOfHour(new Date()), 1), 'h:mm b')
        newTodoData.time = nearestHour
    }
    if (!isValid(new Date(newTodoData.date))) {
        console.log('Error Date')
        events.emit('formInvalid', 'Date is invalid')
        return
    }
    if (!isValid(new Date(`${newTodoData.date} ${newTodoData.time}`))) {
        console.log('Error Time')
        events.emit('formInvalid', 'Time is invalid')
        return
    }
    let dateTime = new Date(`${newTodoData.date} ${newTodoData.time}`)
    newTodoData.date = format(new Date(dateTime), 'M/d/yyyy')
    newTodoData.time = format(new Date(dateTime), 'h:mm a')
    events.emit('inputSanitized', newTodoData)
})

events.on('inputSanitized', function(newTodoData) {
    let newTodo = new Todo(newTodoData.task, newTodoData.date, newTodoData.time, newTodoData.id)
    if (newTodoData.priority === true) {
        newTodo.setPriority()
    }
    if (newTodoData.favorite === true) {
        newTodo.setFavorite()
    }
    todoList.all.push(newTodo)
    events.emit('todoListChanged', todoList)
    events.emit('todoCreated', newTodo)
})

events.on('todoTicketDeleted', function(todoTicketData) {
    todoList.all.filter(todo => {
        if (todo.id === todoTicketData.id) {
            todoList.all.splice(todoList.all.indexOf(todo), 1)
        }
    })
    events.emit('todoListChanged', todoList)
})

events.on('todoListSelected', function(selectedTodoList) {
    if (selectedTodoList === 'All') {
        events.emit('displayTodoList', todoList.all)
    }
    if (selectedTodoList === 'Today') {
        events.emit('displayTodoList', todoList.dueToday())
    }
    if (selectedTodoList === 'Upcoming') {
        events.emit('displayTodoList', todoList.upcoming())
    }
    if (selectedTodoList === 'Important') {
        events.emit('displayTodoList', todoList.important())
    }
    if (selectedTodoList === 'Favorites') {
        events.emit('displayTodoList', todoList.favorites())
    }
})
