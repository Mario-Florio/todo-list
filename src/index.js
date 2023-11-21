import './style.css'
import { createPage, render } from './global-functions'
import { navbar } from "./navbar/navbar"
import { sideMenuModule } from './side-menu/side-menu'
import { header } from './header/header'
import { todoTicketSectionModule } from './todo-tickets/todo-tickets'
import { Todo } from './todos'

// Test

let homePage = createPage([navbar, sideMenuModule, header, todoTicketSectionModule.todoTicketSection])
render(homePage)
