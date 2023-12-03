import { createHTML } from '../global-functions';
import events from '../pub-sub';
import './SideMenu.css';

const SideMenu = (function() {
    const sideMenu = createHTML(`
        <div class="side-menu"></div>
    `);

    const mainLinks = createHTML(`
        <div class="side-menu-main-links">
            <div id="main-links-header">TodoList</div>
            <div class="side-menu-links" data-sort="All">
                <div class="side-menu-links-left-container">
                    <div id="all-icon">
                        <div id="all-icon-left-flange"></div>
                        <div id="all-icon-right-flange"></div>
                    </div>
                    <div>All</div>
                </div>
                <div class="side-menu-links-right-container"></div>
            </div>
            <div class="side-menu-links" data-sort="Today">
                <div class="side-menu-links-left-container">
                    <div id="today-icon"></div>
                    <div>Today</div>
                </div>
                <div class="side-menu-links-right-container"></div>
            </div>
            <div class="side-menu-links" data-sort="Upcoming">
                <div class="side-menu-links-left-container">
                    <div id="upcoming-icon"></div>
                    <div>Upcoming</div>
                </div>
                <div class="side-menu-links-right-container"></div>
            </div>
            <div class="side-menu-links" data-sort="Important">
                <div class="side-menu-links-left-container">
                    <div id="important-icon">!</div>
                    <div>Important</div>
                </div>
                <div class="side-menu-links-right-container"></div>
            </div>
            <div class="side-menu-links" data-sort="Favorites">
                <div class="side-menu-links-left-container">
                    <div id="favorites-icon"></div>
                    <div>Favorites</div>
                </div>
                <div class="side-menu-links-right-container"></div>
            </div>
        </div>
    `);

    const projectsSection = createHTML(`
        <div id="project-section">
            <div id="projects-section-header">
                <div id="projects-section-dropdown-arrow">
                    <div class="projects-section-dropdown-bars" id="projects-section-dropdown-bar1"></div>
                    <div class="projects-section-dropdown-bars" id="projects-section-dropdown-bar2"></div>
                </div>
                <div>Projects</div>
            </div>
            <div class="project-dropdown-menu">
                <div class="project-links"></div>
            </div>
        </div>
    `);

    sideMenu.appendChild(mainLinks);
    sideMenu.appendChild(projectsSection);

    //Cache HTML
    const allQuantity = mainLinks.children[1].children[1];
    const todayIcon = mainLinks.children[2].children[0].children[0];
    const todayQuantity = mainLinks.children[2].children[1];
    const upcomingQuantity = mainLinks.children[3].children[1];
    const importantQuantity = mainLinks.children[4].children[1];
    const favoritesQuantity = mainLinks.children[5].children[1];
    const projectsSectionHeader = projectsSection.children[0];
    const dropdownArrow = projectsSection.children[0].children[0];
    const projectLinks = projectsSection.children[1].children[0];

    //Bind Events
    events.on('hamburgerMenuToggled', function openSideMenu() {
        sideMenu.classList.toggle('side-menu-active');
    });

    projectsSectionHeader.addEventListener('click', () => {
        dropdownArrow.classList.toggle('project-section-dropdown-arrow-active');
        projectsSection.children[1].classList.toggle('project-dropdown-menu-active');
    });

    events.on('setDate', function updateTodayIcon(todaysDate) {
        todayIcon.textContent = todaysDate;
    });

    events.on('projectUpdated', function updateProjectQuantities(project) {
        for (let link of projectLinks.children) {
            if (link.id === project.id) {
                link.children[0].children[1].textContent = project.all.length;
            }
        }
    });

    events.on('projectDeleted', function(project) {
        for (let link of projectLinks.children) {
            if (link.id === project.id) {
                projectsSection.children[1].children[0].removeChild(link);
            }
        }
    });

    events.on('todoListUpdated', function updateQuantities(todoList) {
        if (todoList.all.length > 0) {
            allQuantity.textContent = todoList.all.length;
        } else {
            allQuantity.textContent = '';
        }
        if (todoList.upcoming().length > 0) {
            upcomingQuantity.textContent = todoList.upcoming().length;
        } else {
            upcomingQuantity.textContent = '';
        }
        if (todoList.dueToday().length > 0) {
            todayQuantity.textContent = todoList.dueToday().length;
        } else {
            todayQuantity.textContent = '';
        }
        if (todoList.important().length > 0) {
            importantQuantity.textContent = todoList.important().length;
        } else {
            importantQuantity.textContent = '';
        }
        if (todoList.favorites().length > 0) {
            favoritesQuantity.textContent = todoList.favorites().length;
        } else {
            favoritesQuantity.textContent = '';
        }
    });

    events.on('projectCreated', function(newProject) {
        let newProjectLink = createProjectLink(newProject);
        newProjectLink.id = newProject.id;
        newProjectLink.classList.toggle('new-project-link');
        projectLinks.appendChild(newProjectLink);
    });

    for (let link of mainLinks.children) {
        link.addEventListener('click', function selectSort(e) {
            events.emit('projectSelected', '');
            let selectedSort = e.target.closest('.side-menu-links').dataset.sort;
            events.emit('sortSelected', selectedSort);
        });
    }

    return sideMenu;

})();

export default SideMenu;

function createProjectLink(project) {
    let projectLink = createHTML(`
        <div class="project-links" data-project="${project.name}">
            <div class="side-menu-links">
                <div class="side-menu-links-left-container">${project.name}</div>
                <div class="side-menu-links-right-container"></div>
            </div>
        </div>
    `);

    //Cache HTML
    const projectLinkName = projectLink.children[0].children[0];
    const confirmButton = projectLink.children[0].children[1];

    //Bind Events
    projectLink.addEventListener('click', (e) => {
        let selectedTodolist = {
            selectedSort: 'All',
            selectedProject: e.target.closest('.project-links').dataset.project
        }
        events.emit('projectSelected', selectedTodolist.selectedProject);
        events.emit('todolistSelected', selectedTodolist);
    });

    return projectLink;
}
