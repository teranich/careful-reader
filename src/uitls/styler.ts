const MAX_WORD_CLASSES = 100

export function hightLightElementsOnScreen(
  screenElement: any,
  allElements: any
): any[] {
  const onScreen: any[] = []
  if (!screenElement) return onScreen
  const viewportTop = screenElement.scrollTop
  const viewportHeight = screenElement.clientHeight
  const viewportBottom = viewportTop + viewportHeight
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i]
    if (isOnScreen(el, screenElement)) {
      stylize(el)
      onScreen.push(el)
    }
    if (el.offsetTop > viewportBottom) {
      break
    }
  }
  return onScreen
}

export function getStyledElement(text: string) {
  // const separator = /(?:,| |&nbsp;|\.)+/
  const indexes = shuffle([...Array(MAX_WORD_CLASSES).keys()])
  const separator = ' '
  let index = 0
  const children = text
    .split(separator)
    .map((word: string) => {
      index = index >= MAX_WORD_CLASSES ? 0 : index + 1
      return `<span class="w${indexes[index]}">${word}</span>`
    })
    .join(separator)
  const wrapper = document.createElement('hlw')
  wrapper.innerHTML = children
  return wrapper
}

function shuffle<T>(array: Array<T>) {
  return array.sort(() => Math.random() - 0.5)
}
function textNodesUnder(el: HTMLElement) {
  var n,
    a = [],
    walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false)
  while ((n = walk.nextNode())) a.push(n)
  return a
}

export function stylize(element: HTMLElement) {
  textNodesUnder(element).forEach((textElement: any) => {
    if (textElement && !element.className.includes('hg')) {
      const styledTextElement = getStyledElement(textElement.textContent)
      textElement.replaceWith(styledTextElement)
      element.className += ' hg'
    }
  })
}

function isOnScreen(el: any, screenContainerElement: any) {
  const viewportTop = screenContainerElement.scrollTop
  const viewportHeight = screenContainerElement.clientHeight
  const viewportBottom = viewportTop + viewportHeight
  const top = el.offsetTop
  const height = el.clientHeight
  const bottom = top + height

  return (
    (top >= viewportTop && top < viewportBottom) ||
    (bottom > viewportTop && bottom <= viewportBottom) ||
    (height > viewportHeight && top <= viewportTop && bottom >= viewportBottom)
  )
}
