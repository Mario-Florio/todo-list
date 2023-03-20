import { createHTML } from '../global-functions'
import { events } from '../pub-sub'
import './side-menu.css'

export const sideMenu = createHTML(`
    <div class="side-menu"></div>
`)

const mainLinks = createHTML(`
    <div class="side-menu-main-links">
        <div class="side-menu-links" data-page="All">
            <div class="side-menu-links-left-container">
                <div id="all-icon">
                    <div id="all-icon-left-flange"></div>
                    <div id="all-icon-right-flange"></div>
                </div>
                <div>All</div>
            </div>
            <div class="side-menu-links-right-container"></div>
        </div>
        <div class="side-menu-links" data-page="Today">
            <div class="side-menu-links-left-container">
                <div id="today-icon"></div>
                <div>Today</div>
            </div>
            <div class="side-menu-links-right-container"></div>
        </div>
        <div class="side-menu-links" data-page="Upcoming">
            <div class="side-menu-links-left-container">
                <div id="upcoming-icon"></div>
                <div>Upcoming</div>
            </div>
            <div class="side-menu-links-right-container"></div>
        </div>
        <div class="side-menu-links" data-page="Important">
            <div class="side-menu-links-left-container">
                <div id="important-icon">!</div>
                <div>Important</div>
            </div>
            <div class="side-menu-links-right-container"></div>
        </div>
        <div class="side-menu-links" data-page="Favorites">
            <div class="side-menu-links-left-container">
                <div id="favorites-icon"></div>
                <div>Favorites</div>
            </div>
            <div class="side-menu-links-right-container"></div>
        </div>
    </div>
`)

const projectsSection = createHTML(`
    <div id="project-section">
        <div id="projects-section-header">
            <div id="projects-section-dropdown-arrow">
                <div class="projects-section-dropdown-bars" id="projects-section-dropdown-bar1"></div>
                <div class="projects-section-dropdown-bars" id="projects-section-dropdown-bar2"></div>
            </div>
            <div>Projects</div>
        </div>
        <div class="project-dropdown-menu">
            <div class="project-links">
                <form class="add-project-form">
                    <div class="side-menu-links-left-container">
                        <input id="project-input" type="text" name="project-name" placeholder="Project"/>
                    </div>
                    <button id="add-project-button">
                        <div class="add-project-button-bar1"></div>
                        <div class="add-project-button-bar2"></div>
                    </button>
                </form>
            </div>
        </div>
    </div>
`)

function createProjectLink(project) {
    let projectLink = createHTML(`
        <div class="project-links">
            <div class="side-menu-links">
                <div class="side-menu-links-left-container">${project.name}</div>
                <div class="side-menu-links-right-container">${project.all.length}</div>
            </div>
        </div>
    `)
    return projectLink
}

sideMenu.appendChild(mainLinks)
sideMenu.appendChild(projectsSection)

//Cache HTML
const allQuantity = mainLinks.children[0].children[1]
const todayIcon = mainLinks.children[1].children[0].children[0]
const todayQuantity = mainLinks.children[1].children[1]
const upcomingQuantity = mainLinks.children[2].children[1]
const importantQuantity = mainLinks.children[3].children[1]
const favoritesQuantity = mainLinks.children[4].children[1]
const projectsSectionHeader = projectsSection.children[0]
const dropdownArrow = projectsSection.children[0].children[0]
const projectLinks = projectsSection.children[1].children[0]
const addProjectInput = projectsSection.children[1].children[0].children[0].children[0].children[0]
const addProjectButton = projectsSection.children[1].children[0].children[0].children[1]

//Bind Events
for (let link of mainLinks.children) {
    link.addEventListener('click', (e) => {
        let selectedPage = e.target.closest('.side-menu-links').dataset.page
        events.emit('pageSelected', selectedPage)
    })
}

events.on('hamburgerMenuToggled', function() {
    sideMenu.classList.toggle('side-menu-active')
})

events.on('setDate', function(todaysDate) {
    todayIcon.textContent = todaysDate
})

projectsSectionHeader.addEventListener('click', () => {
    dropdownArrow.classList.toggle('project-section-dropdown-arrow-active')
    projectsSection.children[1].classList.toggle('project-dropdown-menu-active')
})

addProjectButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (addProjectInput.value !== '') {
        let newProjectName = addProjectInput.value
        addProjectInput.value = ''
        events.emit('projectSubmitted', newProjectName)
    }
})

events.on('projectCreated', function(newProject) {
    let newProjectLink = createProjectLink(newProject)
    newProjectLink.classList.toggle('new-project-link')
    projectLinks.insertBefore(newProjectLink, projectLinks.lastElementChild)
})

events.on('todoListChanged', function(todoList) {//Refactor
    if (todoList.all.length > 0) {
        allQuantity.textContent = todoList.all.length
    } else {
        allQuantity.textContent = ''
    }
    if (todoList.upcoming().length > 0) {
        upcomingQuantity.textContent = todoList.upcoming().length
    } else {
        upcomingQuantity.textContent = ''
    }
    if (todoList.dueToday().length > 0) {
        todayQuantity.textContent = todoList.dueToday().length
    } else {
        todayQuantity.textContent = ''
    }
    if (todoList.important().length > 0) {
        importantQuantity.textContent = todoList.important().length
    } else {
        importantQuantity.textContent = ''
    }
    if (todoList.favorites().length > 0) {
        favoritesQuantity.textContent = todoList.favorites().length
    } else {
        favoritesQuantity.textContent = ''
    }
})
