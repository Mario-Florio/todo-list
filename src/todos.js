import { format, isToday, endOfHour, addSeconds, isValid, isThisWeek, startOfDay, addDays, isSunday, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday } from 'date-fns'
import { events } from './pub-sub'

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

const todoList = new TodoList()

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

events.on('todoSubmited', function(newTodoData) {
    newTodoData.id = new Date() //Date serves as unique Id
    if (newTodoData.date === '') {
        newTodoData.date = format(new Date(), 'M/d/yyyy')
    } else {
        newTodoData.date = inputConverter(newTodoData.date)
    }
    if (newTodoData.time === '' && isToday(new Date(newTodoData.date))) {
        let nearestHour = format(addSeconds(endOfHour(new Date()), 1), 'H:mm')
        newTodoData.time = nearestHour
    }
    if (newTodoData.time === '' && !isToday(new Date(newTodoData.date))) {
        let nearestHour = format(addSeconds(startOfDay(new Date()), 1), 'H:mm')
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
    events.emit('date&timeParsed', newTodoData)
})

events.on('date&timeParsed', function(newTodoData) {
    let newTodo = createTodo(newTodoData)
    todoList.all.push(newTodo)
    let newTodoClone = createTodo(newTodo)
    newTodoClone.date = convertData(newTodoData.date)
    events.emit('todoListChanged', todoList)
    events.emit('todoCreated', newTodoClone)
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
        let all = [...todoList.all]//Only shallow copy; still refernces same objects
        all.forEach(todo =>
            todo.date = convertData(todo.date))
        events.emit('displayTodoList', all)
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

let all = [...todoList.all]
        all.forEach(todo =>
            todo.date = convertData(todo.date))
        events.emit('displayTodoList', all)

//Utility
function createTodo(todo) {
    let todoClone = new Todo(todo.task, todo.date, todo.time)
    if (todo.priority === true) {
        todoClone.setPriority()
    }
    if (todo.favorite === true) {
        todoClone.setFavorite()
    }
    return todoClone
}

function convertData(data) {
    if (isToday(new Date(data))) {
        return 'Today'
    }
    if (isThisWeek(new Date(data)) && isSunday(new Date(data))) {
        return 'Sunday'
    }
    if (isThisWeek(new Date(data)) && isMonday(new Date(data))) {
        return 'Monday'
    }
    if (isThisWeek(new Date(data)) && isTuesday(new Date(data))) {
        return 'Tuesday'
    }
    if (isThisWeek(new Date(data)) && isWednesday(new Date(data))) {
        return 'Wednesday'
    }
    if (isThisWeek(new Date(data)) && isThursday(new Date(data))) {
        return 'Thursday'
    }
    if (isThisWeek(new Date(data)) && isFriday(new Date(data))) {
        return 'Friday'
    }
    if (isThisWeek(new Date(data)) && isSaturday(new Date(data))) {
        return 'Saturday'
    }
}

function inputConverter(input) {
    if (input === 'today') {
        return format(new Date(), 'M/d/yyyy')
    }
    if (input === 'tomorrow') {
        return format(addDays(new Date(), 1), 'M/d/yyyy')
    }
    if (input === 'sunday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i)
            if (isSunday(day)) {
                return format(new Date(day), 'M/d/yyyy')
            }
        }
    }
    if (input === 'monday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i)
            if (isMonday(day)) {
                return format(new Date(day), 'M/d/yyyy')
            }
        }
    }
    if (input === 'tuesday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i)
            if (isTuesday(day)) {
                return format(new Date(day), 'M/d/yyyy')
            }
        }
    }
    if (input === 'wednesday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i)
            if (isWednesday(day)) {
                return format(new Date(day), 'M/d/yyyy')
            }
        }
    }
    if (input === 'thursday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i)
            if (isThursday(day)) {
                return format(new Date(day), 'M/d/yyyy')
            }
        }
    }
    if (input === 'friday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i)
            if (isFriday(day)) {
                return format(new Date(day), 'M/d/yyyy')
            }
        }
    }
    if (input === 'saturday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i)
            if (isSaturday(day)) {
                return format(new Date(day), 'M/d/yyyy')
            }
        }
    }
}
