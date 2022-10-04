const drawer = document.querySelector('.drawer__inner');
const drawerButton = document.querySelector('.drawer__button');
const background = document.querySelector('.back-blur');
const select = document.querySelector('.select');
const selectItemActive = document.querySelector('.select__item_active');
const selectContent = document.querySelector('.select__content');

/*Slider settings*/
const slider = document.getElementById('slider-round');


noUiSlider.create(slider, {
    start: ['0', '100'],
    connect: true,
    range: {
        'min': 0,
        'max': 100
    }
});

function normalizeSliderValues(arrayOfValues) {
    return arrayOfValues.map((value) => Number(value).toFixed(0));
}

slider.noUiSlider.on('update', function () {
    const [min, max] = slider.noUiSlider.get();
    const [minAge, maxAge] = normalizeSliderValues([min, max]);
    const sliderValueBlock = document.querySelector('.slider-value');

    sliderValueBlock.innerHTML = `<span>${ minAge }</span>
                                  <span>-</span>
                                  <span>${ maxAge }</span>`;
});

drawerButton.addEventListener('click', () => {
    drawer.classList.toggle('active');
    drawerButton.classList.toggle('active');
    background.classList.toggle('active');
});

function selectOnClick({ target }) {
    selectContent.classList.toggle('select__content--visible');

    const sortOption = target.value;

    if (!sortOption) {
        return;
    }

    const sortBy = target.value.split('-')[0];
    const orderBy = target.value.split('-')[1];

    const imageSrc = orderBy === 'asc'
        ? '../assets/icons/sort-arrow-up.png'
        : '../assets/icons/sort-arrow-down.png';

    selectItemActive.innerHTML = `
                                  <span>${ sortBy }</span>
                                  <img src=${ imageSrc } alt="">
                                  `;

}

select.addEventListener('click', selectOnClick);
