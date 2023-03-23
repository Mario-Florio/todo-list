import { createHTML } from '../global-functions'
import { events } from '../pub-sub'
import './navbar.css'

export const navbar = createHTML(`
    <div class="navbar"></div>
`)

const hamburgerMenu = createHTML(`
    <div id="hamburger-menu">
        <div class="hamburger-menu-bar" id="bar1"></div>
        <div class="hamburger-menu-bar" id="bar2"></div>
        <div class="hamburger-menu-bar" id="bar3"></div>
    </div>
`)

const links = createHTML(`
    <div id="navbar-links">
        <div class="navbar-dropdown-menu-container">
            <div class="navbar-links">TodoList</div>
        </div>
        <div class="navbar-dropdown-menu-container">
            <div class="navbar-links">Projects</div>
        </div>
    </div>
`)

const homeDropdown = createHTML(`
    <div class="navbar-dropdown-menu">
        <div class="navbar-dropdown-menu-links" data-sort="All">All</div>
        <div class="navbar-dropdown-menu-links" data-sort="Today">Today</div>
        <div class="navbar-dropdown-menu-links" data-sort="Upcoming">Upcoming</div>
        <div class="navbar-dropdown-menu-links" data-sort="Important">Important</div>
        <div class="navbar-dropdown-menu-links" data-sort="Favorites">Favorites</div>
    </div>
`)

const projectsDropdown = createHTML(`
    <div class="navbar-dropdown-menu"></div>
`)

const createProjectLink = function(project) {
    const projectLink = createHTML(`
        <div class="navbar-dropdown-menu-links" data-project="${project.name}">${project.name}</div>
    `)
    return projectLink
}

const searchBar = createHTML(`
    <form id="search-bar">
        <div>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        </div>
        <input placeholder="Search" type="search"/>
    </form>
`)

const notificationBell = createHTML(`
    <div id="notification-bell">
        <div class="notification-counter"><div>
    </div>
`)

const accountIcon = createHTML(`
    <div id="account-icon"></div>
`)

const navbarContainerLeft = createHTML(`
    <div class="navbar-left-container"></div>
`)

const navbarContainerRight = createHTML(`
    <div class="navbar-right-container"></div>
`)

navbar.appendChild(navbarContainerLeft)
navbar.appendChild(navbarContainerRight)
navbarContainerLeft.appendChild(hamburgerMenu)
navbarContainerLeft.appendChild(links)
links.children[0].appendChild(homeDropdown)
links.children[1].appendChild(projectsDropdown)
navbarContainerLeft.appendChild(searchBar)
navbarContainerRight.appendChild(notificationBell)
navbarContainerRight.appendChild(accountIcon)

//Cache HTML
const home = links.children[0].children[0]
const projects = links.children[1].children[0]

//Bind Events
hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('hamburger-menu-active')
    events.emit('hamburgerMenuToggled')
})

events.on('todoListUpdated', function(todoList) {
    if (todoList.pastDue().length > 0) {
        notificationBell.children[0].textContent = todoList.pastDue().length
        notificationBell.children[0].classList.add('notification-counter-active')
    } else {
        notificationBell.children[0].classList.remove('notification-counter-active')
    }
})

for (let link of homeDropdown.children) {
    link.addEventListener('click', (e) => {
        events.emit('projectSelected', '')//main links are for TodoList only
        let selectedSort = e.target.dataset.sort
        events.emit('sortSelected', selectedSort)
    })
}

events.on('projectCreated', function(newProject) {//Refactor
    let newProjectLink = createProjectLink(newProject)
    projectsDropdown.appendChild(newProjectLink)
    //Seperate
    newProjectLink.addEventListener('click', (e) => {
        let selectedTodolist = {
            selectedSort: 'All',
            selectedProject: e.target.closest('.navbar-dropdown-menu-links').dataset.project
        }
        events.emit('projectSelected', selectedTodolist.selectedProject)
        events.emit('todolistSelected', selectedTodolist)
    })
})

    //Hover effect
home.addEventListener('mouseenter', () => {
    let dropdownMenu = home.parentNode.children[1]
    dropdownMenu.classList.toggle('navbar-dropdown-menu-active')
})
        
home.addEventListener('mouseleave', () => {
    let dropdownMenu = home.parentNode.children[1]
    dropdownMenu.classList.toggle('navbar-dropdown-menu-active')
})
        
projects.addEventListener('mouseenter', () => {
    let dropdownMenu = projects.parentNode.children[1]
    dropdownMenu.classList.toggle('navbar-dropdown-menu-active')
})
        
projects.addEventListener('mouseleave', () => {
    let dropdownMenu = projects.parentNode.children[1]
    dropdownMenu.classList.toggle('navbar-dropdown-menu-active')
})
        
homeDropdown.addEventListener('mouseenter', () => {
    let dropdownMenu = event.target.parentNode.children[1]
    dropdownMenu.classList.toggle('navbar-dropdown-menu-active')
})
        
homeDropdown.addEventListener('mouseleave', () => {
    let dropdownMenu = event.target.parentNode.children[1]
    dropdownMenu.classList.toggle('navbar-dropdown-menu-active')
})
        
projectsDropdown.addEventListener('mouseenter', () => {
    let dropdownMenu = event.target.parentNode.children[1]
    dropdownMenu.classList.toggle('navbar-dropdown-menu-active')
})
        
projectsDropdown.addEventListener('mouseleave', () => {
    let dropdownMenu = event.target.parentNode.children[1]
    dropdownMenu.classList.toggle('navbar-dropdown-menu-active')
})
