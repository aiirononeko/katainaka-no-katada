import { load } from 'cheerio'

async function fetchUrlMetadata(url: string): Promise<UrlMetadata> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const html = await response.text()
    const $ = load(html)

    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      ''

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      ''

    const image =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      ''

    return { title, description, image }
  } catch (error) {
    console.error('Error fetching URL metadata:', error)
    return { title: '', description: '', image: '' }
  }
}

function generatePreviewCardHtml(metadata: UrlMetadata, url: string): string {
  return `
    <div class="relative border rounded overflow-hidden hover:shadow-md w-full grid grid-cols-3 mt-4 mb-6 h-32 items-center">
      <a href="${url}" class="absolute inset-0 w-full h-full z-10" target="_blank" rel="noopener noreferrer">
        <span class="sr-only">Go to ${metadata.title}</span>
      </a>
      <div class="px-4 col-span-2">
        <span class="font-bold text-lg mb-2 line-clamp-2">${metadata.title}</span>
        <span class="text-xs mb-2 line-clamp-2">${metadata.description}</span>
      </div>
      ${metadata.image ? `<img src="${metadata.image}" alt="${metadata.title}" class="col-span-1" />` : ''}
    </div>
  `
}

export const generateUrlPreviewCards = async (
  content: string,
  metadataFetcher: (url: string) => Promise<UrlMetadata> = fetchUrlMetadata,
): Promise<string> => {
  const urlRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/g

  const urlPromises: Promise<[string, string, UrlMetadata]>[] = []

  let match
  while ((match = urlRegex.exec(content)) !== null) {
    const [fullMatch, url, linkText] = match
    if (url === linkText) {
      urlPromises.push(
        metadataFetcher(url).then((metadata) => [fullMatch, url, metadata]),
      )
    }
  }

  const results = await Promise.all(urlPromises)

  return content.replace(urlRegex, (fullMatch, url, linkText) => {
    if (url === linkText) {
      const result = results.find((r) => r[0] === fullMatch)
      if (result) {
        const [, , metadata] = result
        return generatePreviewCardHtml(metadata, url)
      }
    }
    return fullMatch
  })
}

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
