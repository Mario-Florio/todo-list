import './style.css';
import { format, addSeconds, endOfHour} from 'date-fns';
import Navbar from './Navbar/Navbar';
import SideMenu from './SideMenu/SideMenu';
import Header from './Header/Header';
import TodoTicketsSection from './TodoTicketsSection/TodoTicketsSection';
import KEY from './data/todos';
import events from './pub-sub';

// Create Page
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

// Events
window.addEventListener('load', () => {
    let todaysDate = format(new Date(), 'd');
    let nextHour = format(addSeconds(endOfHour(new Date()), 1), 'h:mm a');
    events.emit('setDate', todaysDate);
    events.emit('setTime', nextHour);
});

// Render
homePage.map(components => root.append(components));
