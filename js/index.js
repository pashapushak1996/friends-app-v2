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

const createFlagUrl = (country) => `https://flagcdn.com/${ country }.svg`;

const user = {
    "gender": "male",
    "name": {
        "title": "Mr",
        "first": "Justin",
        "last": "Rodriguez"
    },
    "location": {
        "street": {
            "number": 7332,
            "name": "Rue de la Barre"
        },
        "city": "Rouen",
        "state": "Deux-Sèvres",
        "country": "France",
    },
    "email": "justin.rodriguez@example.com",
    "login": {
        "uuid": "6e5bac39-083f-422a-924b-672b92406d14",
        "username": "goldenpeacock467",
        "password": "bobo",
        "salt": "cFm7hjQK",
        "md5": "48827fae59f8c40c680598441ec00efe",
        "sha1": "f26f9b9e0b71db25bca93553fa36eafd05f93066",
        "sha256": "957c414367e42fd4bbb9ac4bc4dbbcc9121d27630154ea58bc2012ae6d450116"
    },
    "dob": {
        "date": "1972-11-22T17:00:36.053Z",
        "age": 49
    },
    "registered": {
        "date": "2004-11-25T14:22:42.336Z",
        "age": 17
    },
    "phone": "03-12-04-80-23",
    "cell": "06-01-45-29-35",
    "id": {
        "name": "INSEE",
        "value": "1721076478607 50"
    },
    "picture": {
        "large": "https://randomuser.me/api/portraits/men/71.jpg",
        "medium": "https://randomuser.me/api/portraits/med/men/71.jpg",
        "thumbnail": "https://randomuser.me/api/portraits/thumb/men/71.jpg"
    },
    "nat": "FR"
};
