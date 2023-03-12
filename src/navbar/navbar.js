import { createHTML } from '../global-functions'
import './navbar.css'
import { sideMenu } from '../side-menu/side-menu'

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
            <div class="navbar-links">Home</div>
        </div>
        <div class="navbar-dropdown-menu-container">
            <div class="navbar-links">Projects</div>
        </div>
    </div>
`)

const navbarDropdown = createHTML(`
    <div class="navbar-dropdown-menu">
        <div class="navbar-dropdown-menu-links">All</div>
        <div class="navbar-dropdown-menu-links">Today</div>
        <div class="navbar-dropdown-menu-links">Upcoming</div>
        <div class="navbar-dropdown-menu-links">Important</div>
        <div class="navbar-dropdown-menu-links">Favorites</div>
    </div>
`)

const navbarDropdown2 = createHTML(`
    <div class="navbar-dropdown-menu">
        <div class="navbar-dropdown-menu-links">Project 1</div>
        <div class="navbar-dropdown-menu-links">Project 2</div>
        <div class="navbar-dropdown-menu-links">Project 3</div>
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
    <div class="navbar-left-container"></div>
`)

const navbarContainerRight = createHTML(`
    <div class="navbar-right-container"></div>
`)

//Navbar
navbar.appendChild(navbarContainerLeft)
navbar.appendChild(navbarContainerRight)
//Navbar Left Container
navbarContainerLeft.appendChild(hamburgerMenu)
navbarContainerLeft.appendChild(links)
links.children[0].appendChild(navbarDropdown)
links.children[1].appendChild(navbarDropdown2)
navbarContainerLeft.appendChild(searchBar)
//Navbar Right Container
navbarContainerRight.appendChild (notificationBell)
navbarContainerRight.appendChild(accountIcon)

//Cache HTML
const home = links.children[0].children[0]
const projects = links.children[1].children[0]

//Bind Events
hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('hamburger-menu-active')
    sideMenu.classList.toggle('side-menu-active')
})

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

navbarDropdown.addEventListener('mouseenter', () => {
    let dropdownMenu = event.target.parentNode.children[1]
    dropdownMenu.classList.toggle('navbar-dropdown-menu-active')
})

navbarDropdown.addEventListener('mouseleave', () => {
    let dropdownMenu = event.target.parentNode.children[1]
    dropdownMenu.classList.toggle('navbar-dropdown-menu-active')
})

navbarDropdown2.addEventListener('mouseenter', () => {
    let dropdownMenu = event.target.parentNode.children[1]
    dropdownMenu.classList.toggle('navbar-dropdown-menu-active')
})

navbarDropdown2.addEventListener('mouseleave', () => {
    let dropdownMenu = event.target.parentNode.children[1]
    dropdownMenu.classList.toggle('navbar-dropdown-menu-active')
})
