import { createHTML } from '../global-functions'
import { events } from '../pub-sub'
import './header.css'

export const header = createHTML(`
    <div id="header">
        <div class="slide" data-page="All" data-active>All</div>
        <div class="slide" data-page="Today">Today</div>
        <div class="slide" data-page="Upcoming">Upcoming</div>
        <div class="slide" data-page="Important">Important</div>
        <div class="slide" data-page="Favorites">Favorites</div>
    </div>
`)

//Cache HTML
const links = header.children
const getActiveSlide = function() {
    const activeSlide = header.querySelector('[data-active]')
    return activeSlide
}

//Bind Events
for (let i = 0; i < links.length; i++) {//Activate animations (active slide has special css properties)
    links[i].addEventListener('click', (e) => {
        let activeSlide = getActiveSlide()
        delete activeSlide.dataset.active
        e.target.dataset.active = true
        events.emit('todoListSelected', links[i].dataset.page)
    })
}

events.on('pageSelected', function(data) {
    let activeSlide = getActiveSlide()
    delete activeSlide.dataset.active
    for (let link of links) {
        if (link.dataset.page === data) {
            link.dataset.active = true
            events.emit('todoListSelected', link.dataset.page)
        }
    }
})
