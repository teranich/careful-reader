import { FB2_XSL, FB2_META, FB2_COVER_IMAGE_XSL } from './xsl'

function convertWithXSL(text: string, xsl: string) {
  const parser = new DOMParser()
  const xsltProcessor = new XSLTProcessor()
  const xml = parser.parseFromString(text, 'text/xml')
  const parsedXsl = new window.DOMParser().parseFromString(xsl, 'text/xml')
  xsltProcessor.importStylesheet(parsedXsl)
  return xsltProcessor.transformToFragment(xml, document)
}

export function getBookPreviewInfo(fb2Book: string) {
  const rawMeta = convertWithXSL(fb2Book, FB2_META)
  const meta = rawMeta.textContent ? JSON.parse(rawMeta.textContent) : {}
  const rawCover = convertWithXSL(fb2Book, FB2_COVER_IMAGE_XSL)
  const cover = rawCover.textContent
  return { meta, cover }
}

export function parseToInnerBook(fb2Book: string) {
  const body = convertWithXSL(fb2Book, FB2_XSL)
  return body.children[0].innerHTML || ''
}
