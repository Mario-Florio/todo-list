import {
    format,
    isToday,
    endOfHour,
    addSeconds,
    isValid,
    startOfDay,
} from 'date-fns';
import events from '../pub-sub';
import { inputConverter, dateConverter } from './utility';
import { TodoList, Project, Todo } from './data-structure';

const todoList = new TodoList();
const projects = [];
const LOCAL_STORAGE_LIST_KEY = 'todoList.todoList';

function saveTodoList() {
    let todoListSerialized = JSON.stringify(todoList.all);
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, todoListSerialized);
}

//Bind Events
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
    // Convert Date to Acceptable Format
    if (todoData.date === '') {
        todoData.date = format(new Date(), 'M/d/yyyy');
    } else {
        todoData.date = inputConverter(todoData.date);
    }
    // Set Default Time (if no time is given)
    if (todoData.time === '' && isToday(new Date(todoData.date))) {
        let nextHour = format(addSeconds(endOfHour(new Date()), 1), 'H:mm');
        todoData.time = nextHour;
    } else if (todoData.time === '' && !isToday(new Date(todoData.date))) {
        let nextHour = format(addSeconds(startOfDay(new Date()), 1), 'H:mm');
        todoData.time = nextHour;
    }
    // Validate Date & Time 
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
});

events.on('date&timeInputParsed-CreateTodo', function createTodo(newTodoData) {
    const newTodoId = format(new Date(), 'MM/dd/yyyy HH:mm:ss:SSSS');
    let newTodoProjectId = null;

    if (newTodoData.project !== '') {
        for (let i = 0; i < projects.length; i++) {
            if (newTodoData.project.toLowerCase() === projects[i].name.toLowerCase()) {
                newTodoProjectId = projects[i].id;
            }
        }
    }

    let newTodo = new Todo(
        newTodoId,
        newTodoData.task,
        newTodoData.date,
        newTodoData.time,
        newTodoData.priority,
        newTodoData.favorite,
        newTodoData.project,
    );

    if (newTodoData.project !== '') {
        for (let i = 0; i < projects.length; i++) {
            if (newTodoData.project.toLowerCase() === projects[i].name.toLowerCase()) {
                projects[i].addTodo(newTodo);
                events.emit('projectUpdated', projects[i]);
            }
        }
    }

    todoList.all.push(newTodo);
    saveTodoList();

    let newTodoClone = cloneTodo(newTodo);
    newTodoClone.date = dateConverter(newTodoData.date);

    events.emit('todoListUpdated', todoList);
    events.emit('todoCreated', newTodoClone);
});

events.on('date&timeParsed-UpdateTodo', function(editedTodoData) {
    todoList.all.forEach(todo => {
        if (todo.id === editedTodoData.id) {
            todo.task = editedTodoData.task;
            todo.date = editedTodoData.date;
            todo.time = editedTodoData.time;
            todo.priority = editedTodoData.priority;
            todo.favorite = editedTodoData.favorite;

            console.log(editedTodoData.project)

            // Complete rework
            projects.forEach(project => {
                if (project.id === todo.projectId) {
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
            // Complete rework

            saveTodoList();

            let todoClone = cloneTodo(todo);
            todoClone.date = dateConverter(editedTodoData.date);

            events.emit('todoListUpdated', todoList);
            events.emit('todoDataEdited', todoClone);
            return;
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
        let todosProject = projects.find(project => project.name.toLowerCase() === todoTicketData.project.toLowerCase());
        todosProject.removeTodo(todoTicketData);

        events.emit('todoDeleted-Project', todosProject);
        events.emit('projectUpdated', todosProject);
    }
});

    //Projects
events.on('projectSubmitted', function(projectName) {
    if (projectName !== '') {
        for (let i = 0; i < projects.length; i++) {
            if (projectName.toLowerCase() === projects[i].name.toLowerCase()) {
                return;
            }
        }

        const newProjectId = format(new Date(), 'm/d/yyyy HH:mm:ss:SSSS');
        let newProject = new Project(projectName, newProjectId);
        projects.push(newProject);

        events.emit('projectCreated', newProject);
    }
});

events.on('todoDeleted-Project', function(project) {
    if (project.all.length === 0) {
        let index = projects.findIndex(item => item.id === project.id);
        projects.splice(index, 1);

        events.emit('projectDeleted', project);
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
            todo.date = dateConverter(todo.date);
        });

        events.emit('displayTodoList', todoListClone.all);

        return;
    }

    if (selectedTodolist.selectedSort === 'Today') {
        let dueToday = todoListClone.dueToday();
        dueToday.forEach(todo => {
            todo.date = dateConverter(todo.date);
        });

        events.emit('displayTodoList', dueToday);

        return;
    }

    if (selectedTodolist.selectedSort === 'Upcoming') {
        let upcoming = todoListClone.upcoming();

        upcoming.forEach(todo => {
            todo.date = dateConverter(todo.date);
        });

        events.emit('displayTodoList', upcoming);

        return;
    }

    if (selectedTodolist.selectedSort === 'Important') {
        let important = todoListClone.important();

        important.forEach(todo => {
            todo.date = dateConverter(todo.date);
        });

        events.emit('displayTodoList', important);

        return;
    }

    if (selectedTodolist.selectedSort === 'Favorites') {
        let favorites = todoListClone.favorites();

        favorites.forEach(todo => {
            todo.date = dateConverter(todo.date);
        });

        events.emit('displayTodoList', favorites);

        return;
    }
});

//Utility
function cloneTodo(todo) {
    let todoClone = new Todo(
        todo.id,
        todo.task,
        todo.date,
        todo.time,
        todo.priority,
        todo.favorite,
        todo.project,
    );

    for (let i = 0; i < projects.length; i++) {
        if (projects[i].id === todoClone.projectId) {
            todoClone.project = projects[i].name;
        }
    }

    return todoClone;
}

const LINK = 'Export to connect to bundle';
export default LINK;
