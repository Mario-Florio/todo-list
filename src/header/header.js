import { createHTML } from '../global-functions'
import { events } from '../pub-sub'
import './header.css'

export const header = createHTML(`
    <div id="header">TodoList</div>
`)

export const subHeader = createHTML(`
    <div id="sub-header">
        <div class="slide" data-project data-sort="All" data-active>All</div>
        <div class="slide" data-project data-sort="Today">Today</div>
        <div class="slide" data-project data-sort="Upcoming">Upcoming</div>
        <div class="slide" data-project data-sort="Important">Important</div>
        <div class="slide" data-project data-sort="Favorites">Favorites</div>
    </div>
`)

//Cache HTML
const links = subHeader.children
const getActiveSlide = function() {
    const activeSlide = subHeader.querySelector('[data-active]')
    return activeSlide
}

//Bind Events
for (let link of links) {
    link.addEventListener('click', (e) => {
        let activeSlide = getActiveSlide()
        delete activeSlide.dataset.active
        e.target.dataset.active = true//new active slide
        let selectedTodolist = {
            selectedSort: link.dataset.sort,
            selectedProject: link.dataset.project
        }
        events.emit('todolistSelected', selectedTodolist)
    })
}

events.on('projectSelected', function(selectedProject) {
    for (let link of links) {
        link.dataset.project = selectedProject
    }
})

events.on('sortSelected', function(selectedSort) {
    let activeSlide = getActiveSlide()
    delete activeSlide.dataset.active
    for (let link of links) {
        if (link.dataset.sort === selectedSort) {
            link.dataset.active = true
            let selectedTodolist = {
                selectedSort: link.dataset.sort,
                selectedProject: link.dataset.project
            }
            events.emit('todolistSelected', selectedTodolist)
        }
    }
})
