/* eslint-disable no-magic-numbers */
/* eslint-disable eqeqeq */

const root = document.getElementById('root');

const searchInputRef = document.querySelector('#search-input');
const searchBtnRef = document.querySelector('#search-btn');
const charactersWrapRef = document.querySelector('#characters-wrap');
const loadMoreRef = document.querySelector('.load-more');

searchBtnRef.addEventListener('click', onSearchButtonClick);
loadMoreRef.addEventListener('click', onLoadMoreBtn);

let id = null;
let charactersArray = [];
let idArray = [];
let delta = 0;
let cardWrapRef = 0;
let removeBtnRef;
let currentImg = 5;

if (charactersArray.length <= 5) {
  loadMoreRef.classList.add('hide');
}

if (localStorage.getItem('character') != null) {
  let currentCharacters = localStorage.getItem('character');
  let currentCharactersParse = JSON.parse(currentCharacters);
  charactersArray = currentCharactersParse;

  let currentCharactersId = localStorage.getItem('id');
  let currentCharactersIdParse = JSON.parse(currentCharactersId);
  idArray = currentCharactersIdParse;

  for (let i = 0; i < currentCharactersParse.length; i++) {
    const cardMarkUp = `<div class='card-wrapper' tabIndex='${currentCharactersParse[i].id}'>
          <img src='${currentCharactersParse[i].image}' alt='foto-of-${currentCharactersParse[i].name}' class='image' />
          <button class='delete-character'>x</button>
        </div>
    `;

    charactersWrapRef.insertAdjacentHTML('afterbegin', cardMarkUp);
    if (charactersArray.length >= 5) {
      loadMoreRef.classList.remove('hide');
    }

    removeBtnRef = document.querySelector('.delete-character');
    cardWrapRef = document.querySelectorAll('.card-wrapper');
    removeBtnRef.addEventListener('click', onRemoveBtn);
  }
}

function onSearchButtonClick() {
  id = searchInputRef.value.trim();

  if (
    searchInputRef.value === '' ||
    searchInputRef.value === null ||
    searchInputRef.value === ' ' 
  ) {
    return;
  }

  function getApiRequest(id) {
    return fetch(`https://rickandmortyapi.com/api/character/${id}`).then(
      (response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      }
    );
  }

  getApiRequest(id)
    .then(renderCharactersCard)
    .catch(() => {
      alert('Character not found');
    });

  searchInputRef.value = '';
}

function renderCharactersCard(character) {
  if (!idArray.includes(character.id)) {
    const cardMarkUp = `<div class='card-wrapper' tabIndex='${character.id}'>
          <img src='${character.image}' alt='foto-of-${character.name}' class='image' />
          <button class='delete-character'>x</button>
        </div>
    `;

    charactersWrapRef.insertAdjacentHTML('afterbegin', cardMarkUp);

    removeBtnRef = document.querySelector('.delete-character');
    cardWrapRef = document.querySelectorAll('.card-wrapper');

    removeBtnRef.addEventListener('click', onRemoveBtn);

    charactersArray.push(character);
    const request = JSON.stringify(charactersArray);
    localStorage.setItem('character', request);

    idArray.push(character.id);
    const id = JSON.stringify(idArray);
    localStorage.setItem('id', id);
  } else {
    alert('Character is already in the list');
  }

  currentImg = 5;
  for (let i = 0; i <= cardWrapRef.length - 1; i+=1){  
    if(cardWrapRef.length > 5){
      cardWrapRef[i].classList.add('hide');
      cardWrapRef[0].classList.remove('hide');
      cardWrapRef[1].classList.remove('hide');
      cardWrapRef[2].classList.remove('hide');
      cardWrapRef[3].classList.remove('hide');
      cardWrapRef[4].classList.remove('hide');
    } 
  }

  if (charactersArray.length > 5) {
    loadMoreRef.classList.remove('hide');
  }
}

function onRemoveBtn(e) {
  let deleteConf = confirm('Do you want to delete a character?');
  if (deleteConf) {
    let deleteElem = e.target.parentNode.tabIndex;

    for (let card of cardWrapRef) {
      if (card.tabIndex === deleteElem) {
        card.remove();

        let newArray = charactersArray.filter(
          (item) => item.id != `${deleteElem}`
        );
        const request = JSON.stringify(newArray);
        localStorage.setItem('character', request);
        charactersArray = newArray;

        // delete from local list 'id'
        let newIdArray = idArray.filter((item) => item != `${deleteElem}`);
        const id = JSON.stringify(newIdArray);
        localStorage.setItem('id', id);
        idArray = newIdArray;
      }
    }

    if(cardWrapRef.length > 5){
      cardWrapRef[5].classList.remove('hide');
    } 
  
  } else {
    return;
  }
}

for (let i = 0; i <= cardWrapRef.length - 1; i+=1){
  cardWrapRef[i].classList.add('hide');
  cardWrapRef[0].classList.remove('hide');
  cardWrapRef[1].classList.remove('hide');
  cardWrapRef[2].classList.remove('hide');
  cardWrapRef[3].classList.remove('hide');
  cardWrapRef[4].classList.remove('hide');

  if(cardWrapRef.length > 5){
    cardWrapRef[5].classList.add('hide');
  } 
}

function onLoadMoreBtn() {
  for (let i = 0; i <= cardWrapRef.length - 1; i+=1){
    for (let i = currentImg; i < currentImg + 5; i++) {
      if (cardWrapRef[i]) {
    cardWrapRef[i].classList.remove('hide');
      }
  }
}
 currentImg += 5;

  if (currentImg >= cardWrapRef.length) {
    loadMoreRef.classList.add('hide');
  }

  window.scrollBy({
    top: 2000,
    behavior: 'smooth'
  });
}