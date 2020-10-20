import { FB2XSL, FB2META } from './xsl'

function convertWithXSL(text: string, xsl: string) {
  const parser = new DOMParser()
  const xsltProcessor = new XSLTProcessor()
  const xml = parser.parseFromString(text, 'text/xml')
  const parsedXsl = new window.DOMParser().parseFromString(xsl, 'text/xml')
  xsltProcessor.importStylesheet(parsedXsl)
  return xsltProcessor.transformToFragment(xml, document)
}
export function convertFB2ToInnerBookFormat(fb2Book: string) {
  const meta = convertWithXSL(fb2Book, FB2META)
  const body = convertWithXSL(fb2Book, FB2XSL)

  if (meta.textContent) {
    console.log('parsed', JSON.parse(meta.textContent))
  }
  const cover = body.querySelector('.text-cover img')?.getAttribute('src') || ''
  return {
    documentBody: body.children[0].innerHTML || '',
    cover,
    bookMetaInfo: meta.textContent ? JSON.parse(meta.textContent) : {},
  }
}
