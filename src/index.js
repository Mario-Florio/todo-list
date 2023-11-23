import './style.css';
import Navbar from './Navbar/Navbar';
import SideMenu from './SideMenu/SideMenu';
import Header from './Header/Header';
import TodoTicketsSection from './TodoTicketsSection/TodoTicketsSection';
import Todo from './todos';

const body = document.querySelector('body');
const root = document.createElement('div');
root.id = 'root';
body.append(root);

let homePage = [
    Navbar, 
    SideMenu, 
    Header, 
    TodoTicketsSection,
];

homePage.map(components => root.append(components));
