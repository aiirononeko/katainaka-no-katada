export const highlightCodeBlocks = async (
  content: string,
  highlighter: any,
) => {
  const codeBlockRegex =
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g

  return content.replace(codeBlockRegex, (_, lang, code) => {
    const decodedCode = decodeHTMLEntities(code)
    const highlightedCode = highlighter.codeToHtml(decodedCode.trim(), {
      lang,
      theme: 'solarized-dark',
    })
    return highlightedCode
  })
}

const decodeHTMLEntities = (text: string): string => {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&apos;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#39;': "'",
    '&#47;': '/',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
    '&quot;': '"',
  }
  return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity)
}
