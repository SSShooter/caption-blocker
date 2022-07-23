;(function () {
  function throttle(fn, interval) {
    let lastTime = 0
    const _throttle = function (...args) {
      const nowTime = new Date().getTime()
      const remainTime = nowTime - lastTime
      if (remainTime - interval >= 0) {
        fn.apply(this, args)
        lastTime = nowTime
      }
    }
    return _throttle
  }

  let isMouseDown = false
  let isAdding = false
  const positionA = {
    x: 0,
    y: 0,
  }
  const positionB = {
    x: 0,
    y: 0,
  }
  const mask = document.createElement('div')
  mask.className = 'mask'
  mask.hidden = true
  const placeholder = document.createElement('div')
  placeholder.className = 'placeholder'
  placeholder.hidden = true
  mask.addEventListener('mousedown', (e) => {
    if (isMouseDown) return
    isMouseDown = true
    positionA.x = e.offsetX
    positionA.y = e.offsetY
    placeholder.hidden = false
  })
  mask.addEventListener(
    'mousemove',
    throttle((e) => {
      if (!isMouseDown) return
      placeholder.style.width = `${Math.abs(positionA.x - e.offsetX)}px`
      placeholder.style.height = `${Math.abs(positionA.y - e.offsetY)}px`
      placeholder.style.left = `${Math.min(positionA.x, e.offsetX)}px`
      placeholder.style.top = `${Math.min(positionA.y, e.offsetY)}px`
    }, 100)
  )
  mask.addEventListener('mouseup', (e) => {
    isMouseDown = false
    isAdding = false
    positionB.x = e.offsetX
    positionB.y = e.offsetY

    const blocker = document.createElement('div')
    blocker.className = 'blocker'
    blocker.style.width = `${Math.abs(positionA.x - positionB.x)}px`
    blocker.style.height = `${Math.abs(positionA.y - positionB.y)}px`
    blocker.style.left = `${Math.min(positionA.x, positionB.x)}px`
    blocker.style.top = `${Math.min(positionA.y, positionB.y)}px`
    blocker.addEventListener('dblclick', () => {
      blocker.remove()
    })
    document.body.appendChild(blocker)

    mask.hidden = true
    placeholder.hidden = true
  })
  document.body.append(mask)
  document.body.append(placeholder)
  document.addEventListener('keyup', (e) => {
    if (e.code === 'Escape') {
      mask.hidden = true
      placeholder.hidden = true
      isAdding = false
    }
    if (isAdding) return
    if (e.ctrlKey && e.code === 'KeyB') {
      mask.hidden = false
      isAdding = true
    }
  })
})()
