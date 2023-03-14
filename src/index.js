import './style.css'
import { createPage, render } from './global-functions'
import { navbar } from "./navbar/navbar"
import { sideMenu } from './side-menu/side-menu'
import { header } from './header/header'
import { todoTicketsSection } from './todo-tickets/todo-tickets'

let homePage = createPage([navbar, sideMenu, header, todoTicketsSection])

render(homePage)
