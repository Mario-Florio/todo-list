import { createHTML } from '../global-functions'
import { todoList } from '../todos'
import './header.css'

export const header = createHTML(`
    <div id="header">
        <div class="slide" data-active>All</div>
        <div class="slide">Today</div>
        <div class="slide">Upcoming</div>
        <div class="slide">Important</div>
        <div class="slide">Favorites</div>
    </div>
`)

//Cache HTML
const links = header.children
const getActiveSlide = function() {
    const activeSlide = header.querySelector('[data-active]')
    return activeSlide
}
const all = links[0]
const today = links[1]
const upcoming = links[2]
const important = links[3]
const favorites = links[4]

//Bind Events
for (let i = 0; i < links.length; i++) {//Activate Animations
    links[i].addEventListener('click', () => {
        let activeSlide = getActiveSlide()
        delete activeSlide.dataset.active
        event.target.dataset.active = true  
    })
}

all.addEventListener('click', () => {
    console.log(all)
})

today.addEventListener('click', () => {
    console.log(today)
})

upcoming.addEventListener('click', () => {
    console.log(upcoming)
})

important.addEventListener('click', () => {
    console.log(important)
})

favorites.addEventListener('click', () => {
    console.log(favorites)
})
