// local do JS no HTML faz total diferença. Coloquei no inicio e nao funcionava.
// fetch - promessa ; função para buscar algo passado um atributo
function populateUFs() {
  const ufSelect = document.querySelector('select[name=uf]');
  fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then( res => res.json() ).then( states => {
    for ( const state of states ) {
      ufSelect.innerHTML += `<option value='${state.id}'>${state.nome}</option>`
    }
  });
}

populateUFs();

function getCities(event) {
  const citySelect = document.querySelector('select[name=city]');
  const stateInput = document.querySelector('[name=state]');
  const ufValue = event.target.value;

  const indexOfSelectedState = event.target.selectedIndex;
  stateInput.value = event.target.options[indexOfSelectedState].text;

  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

  citySelect.innerHTML = '<option value="">Selecione a Cidade</option>';
  citySelect.disabled = true;

  fetch(url).then( res => res.json() ).then( cities => {
    for( const city of cities ) {
      citySelect.innerHTML += `<option value='${city.nome}'>${city.nome}</option>`;
    }

    citySelect.disabled = false;
  })
}

document.querySelector('select[name=uf]').addEventListener('change', getCities);
  
/* aprendizados aula 3 - itens de coleta*/
// pegar todos li's
const itemsToCollect = document.querySelectorAll('.items-grid li');

for (const item of itemsToCollect) {
  item.addEventListener('click', handleSelectedItem);
}

const collectedItems = document.querySelector('input[name=items]');
let selectedItems = [];

function handleSelectedItem(event) {
  const itemLi = event.target;
  // adicionar ou remover classe
  itemLi.classList.toggle('selected');
  // salva o id do item clicado na const itemId. 
  const itemId = itemLi.dataset.id;
  
  // salvar no input item selecionado
  // verificar se existem itens selecionados e pegar os selecionados
  const alreadySelected = selectedItems.findIndex( item => item == itemId );
  // se já estiver selecionado, tirar da seleção
  if (alreadySelected >= 0) {
    const filteredItems = selectedItems.filter( item => {
      const itemIsDifferent = item != itemId;
      return itemIsDifferent;
    })
    selectedItems = filteredItems;
  } else {
    // se não estiver selecionado, adicionar a seleção
    selectedItems.push(itemId);
  }
  
  // atualizar o campo escondido com os itens selecionados
  collectedItems.value = selectedItems;

}


