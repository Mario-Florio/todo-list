import { createHTML } from '../global-functions'
import './header.css'

export const header = createHTML(`
    <div id="header">
        <div class="slide">All</div>
        <div class="slide" data-active>Today</div>
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

//Bind Events
for (let i = 0; i < links.length; i++) {//Activate Animations
    links[i].addEventListener('click', () => {
        let activeSlide = getActiveSlide()
        delete activeSlide.dataset.active
        event.target.dataset.active = true  
    })
}
