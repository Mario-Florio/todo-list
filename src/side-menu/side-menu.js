import { isToday } from 'date-fns'
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
        <div class="project-dropdown-menu"></div>
    </div>
`)

function createProjectLink() {
    let projectLink = createHTML(`
        <div class="project-links">
            <div class="side-menu-links">
                <div class="side-menu-links-left-container"></div>
            </div>
        </div>
    `)
}

sideMenu.appendChild(mainLinks)
sideMenu.appendChild(projectsSection)

//Cache HTML
const all = mainLinks.children[0]
const allQuantity = all.children[1]
const today = mainLinks.children[1]
const todayIcon = today.children[0].children[0]
const todayQuantity = today.children[1]
const upcoming = mainLinks.children[2]
const upcomingQuantity = upcoming.children[1]
const important = mainLinks.children[3]
const importantQuantity = important.children[1]
const favorites = mainLinks.children[4]
const favoritesQuantity = favorites.children[1]
const projectsSectionButton = projectsSection.children[0]
const dropdownArrow = projectsSectionButton.children[0]

//Bind Events
for (let link of mainLinks.children) {
    link.addEventListener('click', (e) => {
        let selectedPage = e.target.closest('.side-menu-links').dataset.page
        events.emit('pageSelected', selectedPage)
    })
}

projectsSectionButton.addEventListener('click', () => {
    dropdownArrow.classList.toggle('project-section-dropdown-arrow-active')
    projectsSection.children[1].classList.toggle('project-dropdown-menu-active')
})

events.on('hamburgerMenuToggled', function() {
    sideMenu.classList.toggle('side-menu-active')
})

events.on('setDate', function(todaysDate) {
    todayIcon.textContent = todaysDate
})

events.on('todoListChanged', function(todoList) {
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
