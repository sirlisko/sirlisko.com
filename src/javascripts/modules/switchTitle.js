const descriptions = document.querySelectorAll('.me__intro span')

function switchTitle () {
  const randomPosition = Math.floor(Math.random() * descriptions.length)
  document.querySelector('.me__intro--active').classList.remove('me__intro--active')
  descriptions[randomPosition].classList.add('me__intro--active')
}

setInterval(switchTitle, 5000)
