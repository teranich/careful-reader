export async function convertFB2ToHtml(bookText: string) {
  const parser = new DOMParser()
  const el = parser.parseFromString(bookText, 'text/xml')
  return fetch('reader.xsl')
    .then((res) => res.text())
    .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
    .then((xsl: any) => {
      const xsltProcessor = new XSLTProcessor()
      xsltProcessor.importStylesheet(xsl)
      const html = xsltProcessor.transformToDocument(el) || document
      const cover =
        html.querySelector('.text-cover img')?.getAttribute('src') || ''
      return {
        html: html.body.innerHTML,
        cover,
      }
    })
}
