'use strict'

var test = require('tape')
var fakeEvent = require('simulant')
var proxyquire = require('proxyquireify')(require)

var stubType, stubAction

proxyquire('../src/javascripts/modules/ghost', {
  './beacon': function (type, action) {
    stubType = type
    stubAction = action

    return true
  }
})

test('on ghost mouseover lives are removed', function (t) {
  t.plan(6)

  t.notOk(document.querySelector('.life__heart--ko'), 'full life, life__heart--ko is not present')

  var ghost = document.querySelector('.ghost')
  fakeEvent.fire(ghost, fakeEvent('mouseover'))
  t.ok(document.querySelector('.life__heart--ko'), 'one life is missing, life__heart--ko is present')

  fakeEvent.fire(ghost, fakeEvent('mouseover'))
  t.equal(document.querySelectorAll('.life__heart--ko').length, 2, 'two lives are missing, life__heart--ko is present 2 times')
  t.notOk(document.querySelector('.life').classList.contains('life--over'), 'life is not over yet, life--over is not present')

  fakeEvent.fire(ghost, fakeEvent('mouseover'))
  t.equal(document.querySelectorAll('.life__heart--ko').length, 3, 'three lives are missing, life__heart--ko is present 3 times')
  t.ok(document.querySelector('.life').classList.contains('life--over'), 'life is over, life--over is present')
})

test('on game over beacon is triggered', function (t) {
  t.plan(2)

  var ghost = document.querySelector('.ghost')
  fakeEvent.fire(ghost, fakeEvent('mouseover'))
  fakeEvent.fire(ghost, fakeEvent('mouseover'))
  fakeEvent.fire(ghost, fakeEvent('mouseover'))

  t.equal(stubType, 'goodies', 'the correct type is passed')
  t.equal(stubAction, 'game over', 'the correct type is passed')
})

test('on mousemove the ghost is moving following it', function (t) {
  t.plan(6)

  var ghost = document.querySelector('.ghost')
  ghost.style.position = 'absolute'
  ghost.style.left = '100px'
  ghost.style.top = '100px'

  fakeEvent.fire(ghost, fakeEvent('mousemove'))

  t.equal(ghost.style.left, '-55px', 'the ghost moved in the X axis')
  t.equal(ghost.style.top, '-55px', 'the ghost moved in the Y axis')
  t.ok(ghost.classList.contains('ghost--flipped'), 'the ghost is moving on the left (flipped)')

  ghost.style.left = '-100px'
  ghost.style.top = '-100px'

  fakeEvent.fire(ghost, fakeEvent('mousemove'))

  t.equal(ghost.style.left, '-55px', 'the ghost moved in the X axis')
  t.equal(ghost.style.top, '-55px', 'the ghost moved in the Y axis')
  t.notOk(ghost.classList.contains('ghost--flipped'), 'the ghost is moving on the right (not flipped)')
})
