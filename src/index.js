import './style.css';
import { navbar } from './navbar/navbar';
import { sideMenuModule } from './side-menu/side-menu';
import { header } from './header/header';
import TodoTicketsSection from './TodoTicketsSection/TodoTicketsSection';
import { Todo } from './todos';

const body = document.querySelector('body');
const root = document.createElement('div');
root.id = 'root';
body.append(root);

let homePage = [
    navbar, 
    sideMenuModule, 
    header, 
    TodoTicketsSection,
];

homePage.map(components => root.append(components));
