import './style.css';
import { navbar } from './navbar/navbar';
import { sideMenuModule } from './side-menu/side-menu';
import { header } from './header/header';
import { todoTicketSectionModule } from './todo-tickets/todo-tickets';
import { Todo } from './todos';

const body = document.querySelector('body');
const root = document.createElement('div');
root.id = 'root'
body.append(root);

let homePage = [
    navbar, 
    sideMenuModule, 
    header, 
    todoTicketSectionModule.todoTicketSection
];

homePage.map(components => root.append(components));
