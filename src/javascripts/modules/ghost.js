import beacon from './beacon'

var ghost

const ghostTemplate = `
  <section class="life">
    <p class="life__heart"></p><p class="life__heart"></p><p class="life__heart"></p>
    <p class="life__label">-Game Over-</p>
  </section>
  <figure class="ghost"></figure>`

function gameOver () {
  ghost.removeEventListener('mouseover', ghostOver)

  document.querySelector('.life').classList.add('life--over')

  beacon('goodies', 'game over')
}

function ghostMove (e) {
  e.screenX > ghost.getBoundingClientRect().left + document.body.scrollLeft
    ? ghost.classList.remove('ghost--flipped')
    : ghost.classList.add('ghost--flipped')

  ghost.style.left = `${e.screenX - 55}px`
  ghost.style.top = `${e.screenY - 55}px`
}

function ghostOver () {
  var hearts = document.querySelectorAll('.life__heart:not(.life__heart--ko)')

  hearts[hearts.length - 1].classList.add('life__heart--ko')

  hearts.length === 1 && gameOver()
}

function attachEvents () {
  document.body.insertAdjacentHTML('afterbegin', ghostTemplate)

  ghost = document.querySelector('.ghost')

  document.addEventListener('mousemove', ghostMove)
  ghost.addEventListener('mouseover', ghostOver)
}

!window.ontouchstart && attachEvents()
