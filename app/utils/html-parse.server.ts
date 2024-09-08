import { load } from 'cheerio'

async function fetchUrlMetadata(url: string): Promise<UrlMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; MetadataBot/1.0; +http://example.com/bot)',
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const html = await response.text()
    const $ = load(html)

    // Function to safely get content
    const getContent = (selector: string) =>
      $(selector).first().attr('content') || ''

    let title =
      getContent('meta[property="og:title"]') ||
      getContent('meta[name="twitter:title"]') ||
      $('title').text() ||
      ''

    let description =
      getContent('meta[property="og:description"]') ||
      getContent('meta[name="twitter:description"]') ||
      getContent('meta[name="description"]') ||
      ''

    let image =
      getContent('meta[property="og:image"]') ||
      getContent('meta[name="twitter:image"]') ||
      getContent('meta[name="twitter:image:src"]') ||
      ''

    // X-specific handling
    if (url.includes('x.com') || url.includes('twitter.com')) {
      // Try to get X card data
      const cardData = $('div[data-testid="card.wrapper"]')
      if (cardData.length > 0) {
        title =
          title ||
          cardData.find('span[data-testid="card.layoutLarge.title"]').text()
        description =
          description ||
          cardData.find('span[data-testid="card.layoutLarge.detail"]').text()
        if (!image) {
          const imageElement = cardData.find(
            'img[data-testid="card.layoutLarge.media"]',
          )
          image = imageElement.attr('src') || ''
        }
      }
      // Fallback to tweet content if card data is not available
      if (!title && !description) {
        const tweetText = $('div[data-testid="tweetText"]').text()
        title =
          tweetText.substring(0, 60) + (tweetText.length > 60 ? '...' : '')
        description = tweetText
      }
    }

    return { title, description, image }
  } catch (error) {
    console.error('Error fetching URL metadata:', error)
    return { title: '', description: '', image: '' }
  }
}

function generatePreviewCardHtml(metadata: UrlMetadata, url: string): string {
  console.log(metadata.description)
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
