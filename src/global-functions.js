
export function createHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}

export function render(page) {
    const root = document.getElementById('root');
    while (root.hasChildNodes()) {
        root.removeChild(root.lastChild);
    }
    page.map(component => root.append(component));
}
