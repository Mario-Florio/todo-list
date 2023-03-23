import './style.css'
import { createPage, render } from './global-functions'
import { navbar } from "./navbar/navbar"
import { sideMenu } from './side-menu/side-menu'
import { header } from './header/header'
import { todoTicketSection } from './todo-tickets/todo-tickets'
import { Todo } from './todos'

let homePage = createPage([navbar, sideMenu, header, todoTicketSection])
render(homePage)
