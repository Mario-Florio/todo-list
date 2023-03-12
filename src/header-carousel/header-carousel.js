import { createHTML } from '../global-functions'
import './header-carousel.css'

export const headerCarousel = createHTML(`
    <div class="carousel" data-carousel>
        <button class="carousel-button prev" data-carousel-button="prev">Prev</button>
        <button class="carousel-button next" data-carousel-button="next">Next</button>
        <section aria-label="page-turner">
            <ul data-slides>
                <li class="slide" data-active>
                    <div>All</div>
                </li>
                <li class="slide" data-latent>
                    <div>Today</div>
                </li>    
                <li class="slide">
                    <div>Upcoming</div>
                </li>
                <li class="slide">
                    <div>Important</div>
                </li>
                <li class="slide">
                    <div>Favorites</div>
                </li>
            </ul>
            </section>
    </div>
`)

let buttons = []
const prevButton = headerCarousel.children[0]
const nextButton = headerCarousel.children[1]
buttons.push(prevButton, nextButton)

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const offset = button.dataset.carouselButton === "next" ? 1 : -1 //value assignment for buttons; Next = +1/ Prev = -1
        const slides = button
            .closest("[data-carousel]")
            .querySelector("[data-slides]")

        const activeSlide = slides.querySelector("[data-active]")
        let newActiveIndex = [...slides.children].indexOf(activeSlide) + offset
        if (newActiveIndex < 0) newActiveIndex = slides.children.length - 1
        if (newActiveIndex >= slides.children.length) newActiveIndex = 0

        slides.children[newActiveIndex].dataset.active = true
        delete activeSlide.dataset.active

        const latentSlide = slides.querySelector("[data-latent]")
        let  newLatentIndex = newActiveIndex + 1
        if (newLatentIndex < 0) newLatentIndex = slides.children.length - 1
        if (newLatentIndex >= slides.children.length) newLatentIndex = 0

        slides.children[newLatentIndex].dataset.latent = true
        delete latentSlide.dataset.latent
    })
});