import { createHTML } from '../global-functions'
import './side-menu.css'

export const sideMenu = createHTML(`
    <div class="side-menu"></div>
`)

const mainLinks = createHTML(`
    <div id="side-menu-main-links">
        <div class="side-menu-links">
            <div class="side-menu-links-left-container">
                <div id="all-icon">
                    <div id="all-icon-left-flange"></div>
                    <div id="all-icon-right-flange"></div>
                </div>
                <div>All</div>
            </div>
            <div class="side-menu-links-right-container">7</div>
        </div>
        <div class="side-menu-links">
            <div class="side-menu-links-left-container">
                <div id="today-icon">9</div>
                <div>Today</div>
            </div>
            <div class="side-menu-links-right-container">4</div>
        </div>
        <div class="side-menu-links">
            <div class="side-menu-links-left-container">
                <div id="upcoming-icon"></div>
                <div>Upcoming</div>
            </div>
            <div class="side-menu-links-right-container">14</div>
        </div>
        <div class="side-menu-links">
            <div class="side-menu-links-left-container">
                <div id="important-icon">!</div>
                <div>Important</div>
            </div>
            <div class="side-menu-links-right-container">1</div>
        </div>
        <div class="side-menu-links">
            <div class="side-menu-links-left-container">
                <div id="favorites-icon"></div>
                <div>Favorites</div>
            </div>
            <div class="side-menu-links-right-container">3</div>
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

class Project {
    constructor(name) {
        this.name = name
    }
}

const projects = []

let project = new Project('Project 1')
let project2 = new Project('Project 2')
let project3 = new Project('Project 3')
let project4 = new Project('Project 4')
let project5 = new Project('Project 5')
let project6 = new Project('Project 6')
let project7 = new Project('Project 7')
let project8 = new Project('Project 8')
let project9 = new Project('Project 9')
let project10 = new Project('Project 10')
let project11 = new Project('Project 11')
let project12 = new Project('Project 12')

projects.push(project, project2, project3, project4, project5, project6, project7, project8, project9, project10, project11, project12)

appendProjectLinks()

function appendProjectLinks() {
    for (let i = 0; i < projects.length; i++) {
        let projectLink = createHTML(`
            <div class="project-links">
                <div class="side-menu-links">
                    <div class="side-menu-links-left-container">${projects[i].name}</div>
                </div>
            </div>
        `)
        projectsSection.children[1].appendChild(projectLink)
    }
}

sideMenu.appendChild(mainLinks)
sideMenu.appendChild(projectsSection)

//Cache HTML
const all = mainLinks.children[0]
const today = mainLinks.children[1]
const upcoming = mainLinks.children[2]
const important = mainLinks.children[3]
const projectsSectionButton = projectsSection.children[0]
const dropdownArrow = projectsSectionButton.children[0]

//Bind Events
all.addEventListener('click', () => {
    console.log('all')
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

projectsSectionButton.addEventListener('click', () => {
    dropdownArrow.classList.toggle('project-section-dropdown-arrow-active')
    projectsSection.children[1].classList.toggle('project-dropdown-menu-active')
})