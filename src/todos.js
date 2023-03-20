import { format, isToday, isPast, endOfHour, addSeconds, isValid, isThisWeek, startOfDay, addDays, isSunday, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday } from 'date-fns'
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
        let upcoming = [...this.all].sort((a, b) => 
            new Date(`${a.date} ${a.time}`) > new Date(`${b.date} ${b.time}`) ? 1 : -1)
        return upcoming
    }
    important() {
        let importantTodos = this.all.filter(todo => {
            if (todo.priority) {
                return todo
            }
        })
        return importantTodos
    }
    favorites() {
        let favoriteTodos = this.all.filter(todo => {
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
    pastDue() {//Refactor?
        if (this.date === 'Today' && 
                parseInt(format(new Date(`1/1/1111 ${this.time}`), 'H:mm')) < parseInt(format(new Date(), 'H:mm')) ||
                (parseInt(format(new Date(`1/1/1111 ${this.time}`), 'H:mm')) === parseInt(format(new Date(), 'H:mm')) &&
                 parseInt(format(new Date(`1/1/1111 ${this.time}`), 'mm')) < parseInt(format(new Date(), 'mm')))) {
            return true
        }
        return isPast(new Date(`${this.date} ${this.time}`))
    }
    addToProject(project) {
        project.all.push(this)
    }
}

class Project extends TodoList {
    constructor(name) {
        super()
        this.name = name
    }
    addTodo(todo) {
        this.all.push(todo)
    }
    removeTodo(todoToRemove) {
        this.all.filter(todo => {
            if (todo.id === todoToRemove.id) {
                this.all.splice(this.all.indexOf(todo), 1)
            }
        })
    }
}

const projects = []

//Bind Events
window.addEventListener('load', () => {
    let todaysDate = format(new Date(), 'd')
    events.emit('setDate', todaysDate)
})

    //Todos
events.on('todoSubmited', function(newTodoData) {
    newTodoData.id = format(new Date(), 'MM/dd/yyyy HH:mm:ss:SSSS') //Date serves as unique Id
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
    events.emit('date&timeInputParsed', newTodoData)
})

events.on('date&timeInputParsed', function(newTodoData) {
    let newTodo = new Todo(newTodoData.task, newTodoData.date, newTodoData.time, newTodoData.id)
    if (newTodoData.priority === true) {
        newTodo.setPriority()
    }
    if (newTodoData.favorite === true) {
        newTodo.setFavorite()
    }
    (function validateProjectInput() {
        if (newTodoData.project !== '') {
            for (let i = 0; i < projects.length; i++) {
               if (newTodoData.project === projects[i].name) {
                    newTodo.project = newTodoData.project
                    projects[i].addTodo(newTodo)
                    return
                }
            }
            newTodo.project = newTodoData.project
            let newProject = new Project(newTodoData.project)
            newProject.id = format(new Date(), 'm/d/yyyy HH:mm:ss:SSSS')
            newProject.addTodo(newTodo)
            projects.push(newProject)
            events.emit('projectCreated', newProject)
        } else {
            newTodo.project = newTodoData.project
        }
    })()
    todoList.all.push(newTodo)
    let newTodoClone = cloneTodo(newTodo)
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

events.on('todoListSelected', function(selectedTodoList) {//Refactor?
    let todoListClone = cloneTodoList(todoList)
    function cloneTodoList(todoList) {
        let todoListClone = new TodoList
        todoList.all.forEach(todo => {
            let todoClone = cloneTodo(todo)
            todoListClone.all.push(todoClone)
        })
        return todoListClone
    }
    if (selectedTodoList === 'All') {
        todoListClone.all.forEach(todo => {
            todo.date = convertData(todo.date)
        })
        events.emit('displayTodoList', todoListClone.all)
    }
    if (selectedTodoList === 'Today') {
        let dueToday = todoListClone.dueToday()
        dueToday.forEach(todo => {
            todo.date = convertData(todo.date)
        })
        events.emit('displayTodoList', dueToday)
    }
    if (selectedTodoList === 'Upcoming') {
        let upcoming = todoListClone.upcoming()
        upcoming.forEach(todo => {
            todo.date = convertData(todo.date)
        })
        events.emit('displayTodoList', upcoming)
    }
    if (selectedTodoList === 'Important') {
        let important = todoListClone.important()
        important.forEach(todo => {
            todo.date = convertData(todo.date)
        })
        events.emit('displayTodoList', important)
    }
    if (selectedTodoList === 'Favorites') {
        let favorites = todoListClone.favorites()
        favorites.forEach(todo => {
            todo.date = convertData(todo.date)
        })
        events.emit('displayTodoList', favorites)
    }
})

    //Projects
events.on('projectSubmitted', function(projectName) {
    for (let i = 0; i < projects.length; i++) {
        if (projectName === projects[i].name) {
            return
        }
    }
    let newProject = new Project(projectName)
    newProject.id = format(new Date(), 'm/d/yyyy HH:mm:ss:SSSS')
    projects.push(newProject)
    events.emit('projectCreated', newProject)
})

//Utility
function cloneTodo(todo) {
    let todoClone = new Todo(todo.task, todo.date, todo.time, todo.id)
    if (todo.priority === true) {
        todoClone.setPriority()
    }
    if (todo.favorite === true) {
        todoClone.setFavorite()
    }
    todoClone.project = todo.project
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
    return data
}

function inputConverter(input) {//Refactor?
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
    return input
}
