import { FB2XSL } from './xsl'

export function convertFB2ToHtml(bookText: string) {
  const parser = new DOMParser()
  const el = parser.parseFromString(bookText, 'text/xml')
  const xsl = new window.DOMParser().parseFromString(FB2XSL, 'text/xml')
  const xsltProcessor = new XSLTProcessor()
  xsltProcessor.importStylesheet(xsl)
  const html = xsltProcessor.transformToDocument(el)
  const cover = html.querySelector('.text-cover img')?.getAttribute('src') || ''
  return {
    documentBody: html.body.innerHTML,
    cover,
  }
}
