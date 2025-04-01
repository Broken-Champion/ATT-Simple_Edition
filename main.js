const Body = document.querySelector('body');
const Header = document.getElementById('header');
const Content = document.getElementById('content');
const Footer = document.getElementById('footer');

Body.style.cssText = 'width: 100%; height: 100%; background-color: lightblue;';

Header.style.cssText = `
    width: 100%;
    height: 10%;
    background-color: lightgreen;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const HeaderList = document.createElement('ul');
Header.appendChild(HeaderList);
HeaderList.style.cssText = `
    display: flex;
    height: 100%;
    justify-content: space-around;
    align-items: center;
    list-style-type: none;
    width: 100%;
`;

const firstListItem = document.createElement('li');
firstListItem.classList.add('listItems');
const secondListItem = document.createElement('li');
secondListItem.classList.add('listItems');
const thirdListItem = document.createElement('li');
thirdListItem.classList.add('listItems');
const fourthListItem = document.createElement('li');
fourthListItem.classList.add('listItems');
const fifthListItem = document.createElement('li');
fifthListItem.classList.add('listItems');

HeaderList.appendChild(firstListItem);
HeaderList.appendChild(secondListItem);
HeaderList.appendChild(thirdListItem);
HeaderList.appendChild(fourthListItem);
HeaderList.appendChild(fifthListItem);

const listItems = document.getElementsByClassName('listItems');
for (let i = 0; i < listItems.length; i++) {
    listItems[i].style.cssText = `
        width: 20%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: red;
        margin: 5%;
        border: 1px black solid;        
    `;
    switch(i) {
        case 1:
            listItems[i].textContent = 'Home';
            break;
        case 2:
            listItems[i].textContent = 'Airlines';
            break;
        case 3:
            listItems[i].textContent = 'Airplanes';
            break;
        case 4:
            listItems[i].textContent = 'About';
            break;
    };
}

// Add an image to the first list item
const img = document.createElement('img');
img.src = 'public/assets/logo.png'; // Use a relative path
img.alt = 'AirTrafficTracker Logo';
img.style.cssText = `
    width: 100%;
    height: auto;
`;
firstListItem.appendChild(img);

