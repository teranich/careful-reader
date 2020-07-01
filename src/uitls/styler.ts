const MAX_WORD_CLASSES = 100
const indexes = shuffle([...Array(MAX_WORD_CLASSES).keys()])

function getStyledText(text: string): string {
  // const separator = /(?:,| |&nbsp;|\.)+/
  const separator = ' '
  let index = 0
  return text
    .split(separator)
    .map((word: string) => {
      index = index >= MAX_WORD_CLASSES ? 0 : index + 1
      return `<span class="w${indexes[index]}">${word}</span>`
    })
    .join(separator)
}

function shuffle<T>(array: Array<T>) {
  return array.sort(() => Math.random() - 0.5)
}

export function stylize(html: HTMLDocument) {
  html.querySelectorAll('p').forEach((paragraph: HTMLParagraphElement) => {
    if (paragraph.textContent) {
      paragraph.innerHTML = getStyledText(paragraph.textContent)
    }
  })
  return html
}
