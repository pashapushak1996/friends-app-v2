const drawer = document.querySelector('.drawer__inner');
const drawerButton = document.querySelector('.drawer__button');
const background = document.querySelector('.back-blur');
const select = document.querySelector('.select');
const selectItemActive = document.querySelector('.select__item_active');
const selectContent = document.querySelector('.select__content');
const usersContainer = document.querySelector('.users-container');
const applyButton = document.querySelector('#apply-button');
const headerSearch = document.querySelector('.header__search input');
const resetButton = document.querySelector('#reset-button');
const filterForm = document.forms['filter-form'];
const slider = document.getElementById('slider-round');

const BASE_URL = 'https://randomuser.me/api';

const appState = {
    initialUsers: [],
    searchValue: '',
    userCardIncrease: 12,
    currentPage: 1
};

const filtersState = {
    gender: 'all',
    sortOption: 'default',
    minAge: 0,
    maxAge: 100
};

const setFilters = (filter, value) => {
    filtersState[filter] = value;
};

/*Init functions*/
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const getUsers = async (usersQty = 10, pageIndex) => {
    const response = await fetch(BASE_URL + `/?page=${ pageIndex }&results=${ usersQty }`);

    handleErrors(response);

    const { results: users } = await response.json();

    return users;
};

const normalizeUserObject = (user) => {
    const { gender, name, location, email, dob, phone, picture, nat, login } = user;

    return ({
        gender,
        firstName: name.first,
        lastName: name.last,
        username: login.username,
        age: dob.age,
        email,
        phone,
        picture: picture.large,
        city: location.city,
        country: nat
    });
};

const setUsers = (users) => {
    const normalizedUsers = users.map((user) => normalizeUserObject(user));

    appState.initialUsers.push(...normalizedUsers);
};

const createFlagUrl = (country) => `https://flagcdn.com/40x30/${ country.toLowerCase() }.png`;

const createUserBlock = (user) => {
    const { gender, firstName, lastName, age, email, phone, picture, city, country, username } = user;

    const genderIconUrl = gender === 'male'
        ? './assets/icons/male-filter-icon.svg'
        : './assets/icons/female-filter-icon.svg';

    const countryFlagUrl = createFlagUrl(country);

    const userBlock = document.createElement('div');

    userBlock.className = 'user-info';

    userBlock.innerHTML = `
                          <div class="user-info__header"> 
                            <div class="user-info__city">${ city }</div>
                            <div class="user-info__age">${ age }</div>
                          </div>
                          <div class="user-info__content">
                            <div class="user-info__image">  
                              <img src=${ picture } alt="profile photo">  
                            </div>  
                            <div class="user-info__gender"> 
                              <div class="user-info__gender-icon">  
                                <img src=${ genderIconUrl } alt="gender icon">
                              </div>
                            </div>  
                            <div class="user-info__location">
                              <img src=${ countryFlagUrl } alt="country">
                            </div>
                            <div class="user-info__name">${ firstName } ${ lastName }
                            </div>
                            <div class="user-info__nickname">@${ username }</div>
                            <div class="user-info__contacts">
                              <a href="tel:${ phone }" class="user-info__contact-link"></a>
                              <a href="mailto:${ email }" class="user-info__contact-link"></a>
                            </div>
                          </div>`;

    return userBlock;
};

const renderUsers = (users) => {
    usersContainer.innerHTML = '';

    const usersToRender = users.map((user) => createUserBlock(user));

    usersContainer.append(...usersToRender);
};

const filterByEmail = (searchValue) => (user) => {
    return user.email.includes(searchValue);
};

const normalizeTextValue = (value) => value.trim().toLowerCase();

const searchByEmail = (users) => {
    const emailTextAreaValue = getFormData('email');

    const normalizedValue = normalizeTextValue(emailTextAreaValue);

    const usersToRender = users.filter(filterByEmail(normalizedValue));

    return usersToRender;
};

const compareAge = (userOne, userTwo) => userOne.age - userTwo.age;

const compareName = (userOne, userTwo) => {
    const userOneFullName = (userOne.firstName + userOne.lastName).toLowerCase();
    const userTwoFullName = (userTwo.firstName + userTwo.lastName).toLowerCase();

    if (userOneFullName > userTwoFullName) {
        return 1
    }

    return -1
};

const sortUsers = (users) => {
    const checkedSortOption = filtersState.sortOption.split('-');

    const sortBy = checkedSortOption[0].toLowerCase();
    const orderBy = checkedSortOption[1];


    switch (sortBy) {
        case 'age': {
            const sortedUsers = users.sort(compareAge);

            return orderBy === 'asc'
                ? sortedUsers
                : sortedUsers.reverse();
        }

        case 'name': {
            const sortedUsers = users.sort(compareName);

            return orderBy === 'asc'
                ? sortedUsers
                : sortedUsers.reverse();
        }

        default: {
            return users;
        }
    }
};

const onFormChange = ({ target }) => {
    setFilters(target.name, target.value);
};

filterForm.addEventListener('change', onFormChange)

const filterByGender = (users) => {
    return filtersState.gender !== 'all'
        ? users.filter(user => user.gender === filtersState.gender)
        : users;
};

const filterByAge = (users) => {
    const { minAge, maxAge } = filtersState;
    console.log(minAge);
    console.log(maxAge);

    return users.filter((user) => user.age >= minAge && user.age <= maxAge);
};

const setSearchInput = (value) => {
    appState.searchValue = value
};

const searchByName = ({ target }) => {
    const normalizedValue = normalizeTextValue(target.value);

    setSearchInput(target.value);

    const userInfoBlocks = document.querySelectorAll('.user-info');

    userInfoBlocks.forEach((userBlock) => {
        const userFullName = userBlock.querySelector('.user-info__name').innerText;

        const isVisible = userFullName.toLowerCase().includes(normalizedValue);

        userBlock.classList.toggle('none', !isVisible);
    });
};

const toggleDrawer = () => {
    drawer.classList.toggle('active');
    drawerButton.classList.toggle('active');
    background.classList.toggle('active');
    document.body.classList.toggle('lock');
}

const showUsers = async (pageIndex) => {
    try {
        appState.currentPage = pageIndex;

        const users = await getUsers(appState.userCardIncrease, pageIndex);

        setUsers(users);

        renderUsers(appState.initialUsers);
    } catch (e) {
        console.log(e);
    }
}

const loadMoreBtn = document.querySelector('#load-more');

const loadMoreOnClick = async () => {
    await showUsers(appState.currentPage++)

    const processedUsers = processUsers(appState.initialUsers);

    renderUsers(processedUsers);

    usersContainer.scrollTop = usersContainer.scrollHeight;
};

/*Slider settings*/

noUiSlider.create(slider, {
    start: ['0', '100'], connect: true, range: {
        'min': 0, 'max': 100
    }
});

function normalizeSliderValues(arrayOfValues) {
    return arrayOfValues.map((value) => Number(value).toFixed(0));
}

const onSliderUpdate = () => {
    const [min, max] = slider.noUiSlider.get();

    const [minAge, maxAge] = normalizeSliderValues([min, max]);

    setFilters(['minAge'], minAge);
    setFilters(['maxAge'], maxAge);

    const sliderValueBlock = document.querySelector('.slider-value');

    sliderValueBlock.innerHTML = `<span>${ minAge }</span>
                                  <span>-</span>
                                  <span>${ maxAge }</span>`;
};

slider.noUiSlider.on('update', onSliderUpdate);

const getFormData = (formElement) => {
    return filterForm[formElement].value;
};

const processUsers = (users) => {
    const filteredUsersByAge = filterByAge(users);

    const filteredUsersByGender = filterByGender(filteredUsersByAge);

    const filteredUsersByEmail = searchByEmail(filteredUsersByGender);

    const sortedUsers = sortUsers(filteredUsersByEmail);

    return sortedUsers;
};

const applyOnClick = (e) => {
    e.preventDefault();

    const processedUsers = processUsers(appState.initialUsers);

    renderUsers(processedUsers);

    searchByName({
        target: {
            value: appState.searchValue
        }
    });

    toggleDrawer();
};

const selectOnClick = ({ target }) => {
    selectContent.classList.toggle('select__content--visible');

    const sortOption = target.value;

    if (!sortOption) {
        return;
    }

    const sortBy = target.value.split('-')[0];
    const selectItem = target.closest('.select__item');
    const imageSrc = selectItem.querySelector('img').src;

    selectItemActive.innerHTML = `
                                  <span>${ sortBy }</span>
                                  <img src=${ imageSrc } alt="">
                                  `;

};

const resetOnClick = (e) => {
    e.preventDefault();
    const emailTextArea = document.querySelector('#email');

    emailTextArea.value = '';
    filterForm['all'].checked = true;
    filterForm['default'].checked = true;
    slider.noUiSlider.set([0, 100]);

    selectItemActive.innerHTML = `
                                  <span>Default</span>
                                  <img src="../assets/icons/sort-arrow-default.png" alt="">
                                  `;

    toggleDrawer();

    renderUsers(appState.initialUsers);
};

drawerButton.addEventListener('click', toggleDrawer);
resetButton.addEventListener('click', resetOnClick);
select.addEventListener('click', selectOnClick);
headerSearch.addEventListener('input', searchByName);
applyButton.addEventListener('click', applyOnClick);
loadMoreBtn.addEventListener('click', loadMoreOnClick);

window.addEventListener('load', showUsers);

const userContainerOnScroll = ({ target }) => {
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
        loadMoreBtn.classList.add('active');
    } else {
        loadMoreBtn.classList.remove('active');
    }
};

usersContainer.addEventListener('scroll', userContainerOnScroll);


