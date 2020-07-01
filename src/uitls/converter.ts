export async function convertFB2ToHtml(bookText: string) {
  const parser = new DOMParser()
  const el = parser.parseFromString(bookText, 'text/xml')
  return fetch('reader.xsl')
    .then((res) => res.text())
    .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
    .then((xsl: any) => {
      const xsltProcessor = new XSLTProcessor()
      xsltProcessor.importStylesheet(xsl)
      return xsltProcessor.transformToDocument(el)
    })
}
