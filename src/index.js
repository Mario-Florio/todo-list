import './style.css'
import { createPage, render } from './global-functions'
import { formatDistance, addWeeks, addDays, subDays } from 'date-fns'
import { navbar } from "./navbar/navbar"
import { sideMenu } from './side-menu/side-menu'
import { header } from './header/header'
import { todoTicketsSection } from './todo-tickets/todo-tickets'

let distanceBetweenDatesInRealWords = formatDistance(addWeeks(new Date(), 5), new Date(), { addSuffix: true })

let homePage = createPage([navbar, sideMenu, header, todoTicketsSection])

render(homePage)
