const drawer = document.querySelector('.drawer__inner');
const drawerButton = document.querySelector('.drawer__button');
const background = document.querySelector('.back-blur');

drawerButton.addEventListener('click', () => {
    drawer.classList.toggle('active');
    drawerButton.classList.toggle('active');
    background.classList.toggle('active');
});

function toggleClass(element) {
    element.classList.toggle('active');
}
