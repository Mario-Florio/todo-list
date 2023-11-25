import {
    format,
    isToday,
    isPast,
} from 'date-fns';

class TodoList {
    constructor() {
        this.all = [];
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
        let upcoming = this.all.filter(todo => {
            let todosDate = new Date(`${todo.date} ${todo.time}`);
            if (todosDate > new Date()) {
                return todo;
            }
        });
        upcoming.sort((a, b) => 
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

class Todo {
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

export {
    TodoList,
    Todo,
    Project,
}
