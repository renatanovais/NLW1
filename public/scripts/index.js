const buttonSearch = document.querySelector('#page-home main a');
const modal = document.querySelector('#modal');
const closeX = document.querySelector('#modal .header a');

buttonSearch.addEventListener('click', () => {
  modal.classList.remove('hide');
});

closeX.addEventListener('click', () => {
  modal.classList.add('hide');
})
