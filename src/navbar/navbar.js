import { createHTML } from '../global-functions'
import './navbar.css'
import { sideMenu } from '../side-menu/side-menu'

export const navbar = createHTML(`
    <div class="navbar"></div>
`)

const hamburgerMenu = createHTML(`
    <div id="hamburger-menu">
        <div class="bar" id="bar1"></div>
        <div class="bar" id="bar2"></div>
        <div class="bar" id="bar3"></div>
    </div>
`)

const links = createHTML(`
    <div id="navbar-links">
        <div class="navbar-links">Today</div>
        <div class="navbar-links">Projects</div>
    </div>
`)

const searchBar = createHTML(`
    <form id="search-bar">
        <button>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        </button>
        <input placeholder="Search" type="search"/>
    </form>
`)

const notificationBell = createHTML(`
    <div id="notification-bell">
        <div id="notification-counter"><div>
    </div>
`)

const accountIcon = createHTML(`
    <div id="account-icon"></div>
`)

const navbarContainerLeft = createHTML(`
    <div class="navbar-container-left"></div>
`)

const navbarContainerRight = createHTML(`
    <div class="navbar-container-right"></div>
`)

navbar.appendChild(navbarContainerLeft)
navbar.appendChild(navbarContainerRight)
navbarContainerLeft.appendChild(hamburgerMenu)
navbarContainerLeft.appendChild(links)
navbarContainerLeft.appendChild(searchBar)
navbarContainerRight.appendChild (notificationBell)
navbarContainerRight.appendChild(accountIcon)

//Cache HTML
const today = links.children[0]
const projects = links.children[1]

//Bind Events
hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('is-active')
    sideMenu.classList.toggle('side-menu-active')
})

today.addEventListener('click', () => {
    console.log('today')
})

projects.addEventListener('click', () => {
    console.log('projects')
})