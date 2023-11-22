import {
    format,
    isToday,
    isPast,
    endOfHour,
    addSeconds,
    isValid,
    isThisWeek,
    startOfDay,
    addDays,
    isSunday,
    isMonday,
    isTuesday,
    isWednesday,
    isThursday,
    isFriday,
    isSaturday
    } from 'date-fns';
import { events } from './pub-sub';

class TodoList {
    constructor() {
        all = [];
    }

    dueToday() {
        let dueToday = this.all.filter(todo => {
            let todosDate = new Date(todo.date);
            if (isToday(todosDate)) {
                return todo;
            }
        });
        dueToday.sort((a, b) => 
            new Date(`${a.date} ${a.time}`) > new Date(`${b.date} ${b.time}`) ? 1 : -1);
        return dueToday;
    }

    upcoming() {
        let upcoming = [...this.all].sort((a, b) => 
            new Date(`${a.date} ${a.time}`) > new Date(`${b.date} ${b.time}`) ? 1 : -1);
        return upcoming;
    }

    important() {
        let importantTodos = this.all.filter(todo => {
            if (todo.priority) {
                return todo;
            }
        });
        return importantTodos;
    }

    favorites() {
        let favoriteTodos = this.all.filter(todo => {
            if (todo.favorite) {
                return todo;
            }
        });
        return favoriteTodos;
    }

    pastDue() {
        let pastDue = this.all.filter(todo => {
            if (todo.pastDue()) {
                return todo;
            }
        });
        return pastDue;
    }
}

const todoList = new TodoList();
const LOCAL_STORAGE_LIST_KEY = 'todoList.todoList';

function saveTodoList() {
    let todoListSerialized = JSON.stringify(todoList.all);
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, todoListSerialized);
}

export class Todo {
    constructor(task, date, time, id) {
        this.task = task;
        this.date = date;
        this.time = time;
        this.id = id;
    }

    setPriority() {
        this.priority = true;
    }

    removePriority() {
        delete this.priority;
    }

    setFavorite() {
        this.favorite = true;
    }

    removeFavorite() {
        delete this.favorite;
    }

    pastDue() {
        if (
                this.date === 'Today' && 
                parseInt(format(new Date(`1/1/1111 ${this.time}`), 'H:mm')) < parseInt(format(new Date(), 'H:mm')) ||
                (parseInt(format(new Date(`1/1/1111 ${this.time}`), 'H:mm')) === parseInt(format(new Date(), 'H:mm')) &&
                parseInt(format(new Date(`1/1/1111 ${this.time}`), 'mm')) < parseInt(format(new Date(), 'mm')))
            ) {
            return true;
        }
        return isPast(new Date(`${this.date} ${this.time}`));
    }

    addToProject(project) {
        project.all.push(this);
    }
}

class Project extends TodoList {
    constructor(name) {
        super();
        this.name = name;
    }

    addTodo(todo) {
        this.all.push(todo);
    }

    removeTodo(todoToRemove) {
        delete todoToRemove.project;
        let todoToRemoveIndex = this.all.findIndex(todo => todo.id === todoToRemove.id);
        this.all.splice(todoToRemoveIndex, 1);
    }
}

const projects = [];

//Bind Events
window.addEventListener('load', () => {
    let todaysDate = format(new Date(), 'd');
    let nextHour = format(addSeconds(endOfHour(new Date()), 1), 'h:mm a');
    events.emit('setDate', todaysDate);
    events.emit('setTime', nextHour);
});

window.addEventListener('load', () => {
    let todoListDeserialized = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY));
    let todoListAllClone = todoListDeserialized || [];

    todoListAllClone.forEach(todo => {
        if (todo.project) {
            events.emit('projectSubmitted', todo.project);
        }
        todo.type = 'Create';
        events.emit('todoSubmitted', todo);
    });
});

    //Todos
events.on('todoSubmitted', function parseDateTime(todoData) {
    if (todoData.date === '') {
        todoData.date = format(new Date(), 'M/d/yyyy');
    } else {
        todoData.date = inputConverter(todoData.date);
    }
    if (todoData.time === '' && isToday(new Date(todoData.date))) {
        let nextHour = format(addSeconds(endOfHour(new Date()), 1), 'H:mm');
        todoData.time = nextHour;
    }
    if (todoData.time === '' && !isToday(new Date(todoData.date))) {
        let nextHour = format(addSeconds(startOfDay(new Date()), 1), 'H:mm');
        todoData.time = nextHour;
    }
    if (!isValid(new Date(todoData.date))) {
        return;
    }
    if (!isValid(new Date(`${todoData.date} ${todoData.time}`))) {
        return;
    }

    let dateTime = new Date(`${todoData.date} ${todoData.time}`);
    todoData.date = format(new Date(dateTime), 'M/d/yyyy');
    todoData.time = format(new Date(dateTime), 'h:mm a');

    if (todoData.type === 'Create') {
        events.emit('date&timeInputParsed-CreateTodo', todoData);
    }
    if (todoData.type === 'Update') {
        events.emit('date&timeParsed-UpdateTodo', todoData);
    }
})

events.on('date&timeInputParsed-CreateTodo', function createTodo(newTodoData) {
    newTodoData.id = format(new Date(), 'MM/dd/yyyy HH:mm:ss:SSSS');
    let newTodo = new Todo(newTodoData.task, newTodoData.date, newTodoData.time, newTodoData.id);

    if (newTodoData.priority === true) {
        newTodo.setPriority();
    }
    if (newTodoData.favorite === true) {
        newTodo.setFavorite();
    }

    newTodo.project = newTodoData.project;

    if (newTodoData.project !== '') {
        for (let i = 0; i < projects.length; i++) {
            if (newTodoData.project === projects[i].name) {
                projects[i].addTodo(newTodo);
                events.emit('projectUpdated', projects[i]);
            }
        }
    }

    todoList.all.push(newTodo);
    saveTodoList();

    let newTodoClone = cloneTodo(newTodo);
    newTodoClone.date = convertData(newTodoData.date);

    events.emit('todoListUpdated', todoList);
    events.emit('todoCreated', newTodoClone);
})

events.on('date&timeParsed-UpdateTodo', function(editedTodoData) {
    todoList.all.forEach(todo => {
        if (todo.id === editedTodoData.id) {
            todo.task = editedTodoData.task;
            todo.date = editedTodoData.date;
            todo.time = editedTodoData.time;

            if (editedTodoData.priority === true) {
                todo.setPriority();
            } else {
                todo.removePriority();
            }
            if (editedTodoData.favorite === true) {
                todo.setFavorite();
            } else {
                todo.removeFavorite();
            }

            projects.forEach(project => {
                if (project.name === todo.project) {
                    project.removeTodo(todo);
                    events.emit('todoDeleted-Project', project);
                    events.emit('projectUpdated', project);
                }
            });

            todo.project = editedTodoData.project;

            if (todo.project !== '') {
                for (let i = 0; i < projects.length; i++) {
                    if (todo.project === projects[i].name) {
                        projects[i].addTodo(todo);
                        events.emit('projectUpdated', projects[i]);
                    }
                }
            }

            saveTodoList();

            let todoClone = cloneTodo(todo);
            todoClone.date = convertData(editedTodoData.date);

            events.emit('todoListUpdated', todoList);
            events.emit('todoDataEdited', todoClone);
        }
    });
});

events.on('todoTicketDeleted', function(todoTicketData) {
    (function deleteFromTodoList() {
        let index = todoList.all.findIndex(todo => todo.id === todoTicketData.id);
        todoList.all.splice(index, 1);

        saveTodoList();

        events.emit('todoListUpdated', todoList);
    })();

    if (todoTicketData.project) {
        let todosProject = projects.find(project => project.name === todoTicketData.project);
        todosProject.removeTodo(todoTicketData);

        events.emit('todoDeleted-Project', todosProject);
        events.emit('projectUpdated', todosProject);
    }
});

    //Projects
events.on('projectSubmitted', function(projectName) {
    if (projectName !== '') {
        for (let i = 0; i < projects.length; i++) {
            if (projectName === projects[i].name) {
                return;
            }
        }

        let newProject = new Project(projectName);
        newProject.id = format(new Date(), 'm/d/yyyy HH:mm:ss:SSSS');
        projects.push(newProject);

        events.emit('projectCreated', newProject);
    }
});

events.on('projectNameEdited', function(editedProject) {
    let project = projects.find(project => project.id === editedProject.id);
    project.name = editedProject.name;
    project.all.forEach(todo => todo.project = project.name);

    saveTodoList();
});

events.on('todoDeleted-Project', function(project) {
    if (project.all.length === 0) {
        events.emit('projectDeleted', project);

        let index = projects.findIndex(item => item.id === project.id);
        projects.splice(index, 1);
    }
});

    //TodoList
events.on('todolistSelected', function displayTodos(selectedTodolist) {
    function cloneTodoList(todoList) {
        let todoListClone = new TodoList;
        todoList.all.forEach(todo => {
            let todoClone = cloneTodo(todo);
            todoListClone.all.push(todoClone);
        });
        return todoListClone;
    }

    let todoListClone = cloneTodoList(todoList);

    for (let project of projects) {
        if (project.name === selectedTodolist.selectedProject) {
            todoListClone = cloneTodoList(project);
        }
    }

    if (selectedTodolist.selectedSort === 'All') {
        todoListClone.all.forEach(todo => {
            todo.date = convertData(todo.date);
        });

        events.emit('displayTodoList', todoListClone.all);

        return;
    }

    if (selectedTodolist.selectedSort === 'Today') {
        let dueToday = todoListClone.dueToday();
        dueToday.forEach(todo => {
            todo.date = convertData(todo.date);
        });

        events.emit('displayTodoList', dueToday);

        return;
    }

    if (selectedTodolist.selectedSort === 'Upcoming') {
        let upcoming = todoListClone.upcoming();

        upcoming.forEach(todo => {
            todo.date = convertData(todo.date);
        });

        events.emit('displayTodoList', upcoming);

        return;
    }

    if (selectedTodolist.selectedSort === 'Important') {
        let important = todoListClone.important();

        important.forEach(todo => {
            todo.date = convertData(todo.date);
        });

        events.emit('displayTodoList', important);

        return;
    }

    if (selectedTodolist.selectedSort === 'Favorites') {
        let favorites = todoListClone.favorites();

        favorites.forEach(todo => {
            todo.date = convertData(todo.date);
        });

        events.emit('displayTodoList', favorites);

        return;
    }
});

//Utility
function cloneTodo(todo) {
    let todoClone = new Todo(todo.task, todo.date, todo.time, todo.id);

    if (todo.priority === true) {
        todoClone.setPriority();
    }

    if (todo.favorite === true) {
        todoClone.setFavorite();
    }

    todoClone.project = todo.project;

    return todoClone;
}

function convertData(date) {
    if (isToday(new Date(date))) {
        return 'Today';
    }

    if (isThisWeek(new Date(date)) && !isPast(new Date(date))) {
        switch (new Date(date).getDay()) {
            case 0:
                date = "Sunday";
                break;
            case 1:
                date = "Monday";
                break;
            case 2:
                date = "Tuesday";
                break;
            case 3:
                date = "Wednesday";
                break;
            case 4:
                date = "Thursday";
                break;
            case 5:
                date = "Friday";
                break;
            case 6:
                date = "Saturday";
        }
    }
    return date;
}

function inputConverter(input) {
    if (input === 'today') {
        return format(new Date(), 'M/d/yyyy');
    }

    if (input === 'tomorrow') {
        return format(addDays(new Date(), 1), 'M/d/yyyy');
    }

    if (input === 'sunday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);
            if (isSunday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }

    if (input === 'monday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);
            if (isMonday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }

    if (input === 'tuesday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);

            if (isTuesday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }

    if (input === 'wednesday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);

            if (isWednesday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }

    if (input === 'thursday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);

            if (isThursday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }

    if (input === 'friday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);

            if (isFriday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }

    if (input === 'saturday') {
        for (let i = 0; i < 7; i++) {
            let day = addDays(new Date(), i);

            if (isSaturday(day)) {
                return format(new Date(day), 'M/d/yyyy');
            }
        }
    }
    
    return input;
}
