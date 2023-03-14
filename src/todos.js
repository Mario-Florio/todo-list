import { events } from "./pub-sub"

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
    addToProject(project) {
        project.push(this)
    }
}
