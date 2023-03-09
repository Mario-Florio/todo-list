import { createHTML } from '../global-functions'
import './side-menu.css'

export const sideMenu = createHTML(`
    <div class="side-menu"></div>
`)

const mainLinks = createHTML(`
    <div id="side-menu-links">
        <div class="side-menu-links">
            <div id="inbox-icon">
                <div id="inbox-icon-left-flange"></div>
                <div id="inbox-icon-right-flange"></div>
            </div>
            <div>Inbox</div>
        </div>
        <div class="side-menu-links">
            <div id="today-icon">9</div>
            <div>Today</div>
        </div>
        <div class="side-menu-links">
            <div id="upcoming-icon"></div>
            <div>Upcoming</div>
        </div>
        <div class="side-menu-links">
            <div id="important-icon">!</div>
            <div>Important</div>
        </div>
    </div>
`)

const projects =createHTML(`
    <div id="projects-label">
        <div id="dropdown-arrow">
            <div class="dropdown-bars" id="dropdown-bar1"></div>
            <div class="dropdown-bars" id="dropdown-bar2"></div>
        </div>
        <div>Projects</div>
    </div>
`)

sideMenu.appendChild(mainLinks)
sideMenu.appendChild(projects)

//Cache HTML
const inbox = mainLinks.children[0]
const today = mainLinks.children[1]
const upcoming = mainLinks.children[2]
const important = mainLinks.children[3]
const dropdownArrow = projects.children[0]

//Bind Events
inbox.addEventListener('click', () => {
    console.log('inbox')
})

today.addEventListener('click', () => {
    console.log('today')
})

upcoming.addEventListener('click', () => {
    console.log('upcoming')
})

important.addEventListener('click', () => {
    console.log('important')
})

projects.addEventListener('click', () => {
    dropdownArrow.classList.toggle('arrow-mode')
})