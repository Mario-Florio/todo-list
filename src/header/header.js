import { createHTML } from '../global-functions'
import { events } from '../pub-sub'
import './header.css'

export const header = createHTML(`
    <div>
        <div id="header">TodoList</div>
    </div>
`)

const subHeader = createHTML(`
    <div id="sub-header">
        <div class="slide" data-project data-sort="All" data-active>All</div>
        <div class="slide" data-project data-sort="Today">Today</div>
        <div class="slide" data-project data-sort="Upcoming">Upcoming</div>
        <div class="slide" data-project data-sort="Important">Important</div>
        <div class="slide" data-project data-sort="Favorites">Favorites</div>
    </div>
`)

header.appendChild(subHeader)

//Cache HTML
const sortLinks = subHeader.children
const getActiveSlide = function() {
    const activeSlide = subHeader.querySelector('[data-active]')
    return activeSlide
}

//Bind Events
events.on('todolistSelected', function setHeader(selectedTodolist) {
    if (selectedTodolist.selectedProject === '') {
        header.children[0].textContent = 'TodoList'
    } else {
        header.children[0].textContent = selectedTodolist.selectedProject
    }
})

for (let link of sortLinks) {
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

events.on('sortSelected', function(selectedSort) {
    let activeSlide = getActiveSlide()
    delete activeSlide.dataset.active
    for (let link of sortLinks) {
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

events.on('projectSelected', function(selectedProject) {
    for (let link of sortLinks) {
        link.dataset.project = selectedProject
    }
})
