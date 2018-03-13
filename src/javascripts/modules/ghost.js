import beacon from './beacon'

const ghostTemplate = `
  <section class="life">
    <p class="life__heart"></p><p class="life__heart"></p><p class="life__heart"></p>
    <p class="life__label">-Game Over-</p>
  </section>
  <figure class="ghost"></figure>
`

const gameOver = (ghost) => () => {
  ghost.removeEventListener('mouseover', ghostOver)
  document.querySelector('.life').classList.add('life--over')
  beacon('goodies', 'game over')
}

const ghostMove = (ghost) => (e) => {
  e.screenX > ghost.getBoundingClientRect().left + document.body.scrollLeft
    ? ghost.classList.remove('ghost--flipped')
    : ghost.classList.add('ghost--flipped')
  ghost.style.left = `${e.screenX - 55}px`
  ghost.style.top = `${e.screenY - 55}px`
}

const ghostOver = (ghost) => () => {
  var hearts = document.querySelectorAll('.life__heart:not(.life__heart--ko)')
  hearts[hearts.length - 1].classList.add('life__heart--ko')
  hearts.length === 1 && gameOver(ghost)()
}

const attachEvents = () => {
  document.body.insertAdjacentHTML('afterbegin', ghostTemplate)
  const ghost = document.querySelector('.ghost')
  document.addEventListener('mousemove', ghostMove(ghost))
  ghost.addEventListener('mouseover', ghostOver(ghost))
}

!window.ontouchstart && attachEvents()
