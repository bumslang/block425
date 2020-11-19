const container = document.querySelector('.container');
const input = document.querySelector('input');
const wrapper = document.querySelector('.wrapper')
let p = document.querySelectorAll('p');
p = [...p];
let arrOfCards;
let card = document.createElement('div');

input.addEventListener('keyup',debounce(getResult, 500));
async function getResult() {
    if (input.value === '') {
        p.forEach(elem => {
            elem.innerHTML = '';
        })
    }
    let answer = await fetch(`https://api.github.com/search/repositories?q=${input.value}&sort=stars&order=desc`)
    let answerJson = await answer.json();
    let answerItems = await answerJson.items;
    localStorage.clear()
    for (let i = 0; i < 5; i++) {
        try {
            p[i].innerHTML = `${answerItems[i].name}`;
            localStorage.setItem(`${answerItems[i].name}`, `Name: ${answerItems[i].name} \nOwner: ${answerItems[i].owner.login} \nStars: ${answerItems[i].stargazers_count} \n`);
        } catch (error) {
            
        }
    }  
}

function debounce(func, wait, immediate){
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
  };

wrapper.addEventListener('click', function(e) {
    if (e.target.innerHTML === '[X]') {
        e.target.parentNode.remove();
    } else {
        let result = document.querySelector('.result');
        let pre  = document.createElement('pre');
        pre.style.display = 'flex';
        pre.style.justifyContent = 'space-between';
        pre.style.marginBottom = '10px';
        pre.classList.add(e.target.innerHTML);
        pre.innerHTML = localStorage.getItem(e.target.innerHTML); 
        pre.insertAdjacentHTML('beforeend', '<b>[X]</b>');
        result.insertAdjacentElement('afterbegin', pre);
        p.forEach(elem => elem.innerHTML = '');
        input.value = '';
    }
})