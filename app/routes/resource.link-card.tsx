import { LoaderFunctionArgs, json } from '@remix-run/cloudflare'

interface MetaInfo {
  type: 'ogp' | 'twitter'
  title: string
  description: string
  ogImage: string
  twitterHtml?: string
}

interface TwitterOEmbedResponse {
  author_name: string
  author_url: string
  html: string
  provider_name: string
  provider_url: string
  type: string
  version: string
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const requestUrl = new URL(request.url)
  const url = requestUrl.searchParams.get('url')
  if (!url) return json({ error: 'URL is required' }, { status: 400 })

  try {
    // Twitter URLかどうかを判断
    const isTwitterUrl = url.includes('twitter.com') || url.includes('x.com')

    if (isTwitterUrl) {
      // Twitter OEmbed APIを使用して埋め込みHTMLを取得
      const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`
      const oembedResponse = await fetch(oembedUrl)
      const oembedData = (await oembedResponse.json()) as TwitterOEmbedResponse

      const metaInfo: MetaInfo = {
        type: 'twitter',
        title: oembedData.author_name,
        description:
          oembedData.html.replace(/<[^>]+>/g, '').slice(0, 100) + '...',
        ogImage: '', // Twitterはogpの画像を直接提供しないため空文字列にしています
        twitterHtml: oembedData.html,
      }

      return json(metaInfo)
    } else {
      // 通常のウェブページの場合
      const response = await fetch(url)
      const html = await response.text()

      // メタ情報を抽出する関数
      const extractMetaInfo = (html: string): MetaInfo => {
        const getTag = (name: string) => {
          const match = html.match(
            new RegExp(`<${name}[^>]*>([^<]*)</${name}>`, 'i'),
          )
          return match ? match[1] : ''
        }
        const getMeta = (name: string) => {
          const match =
            html.match(
              new RegExp(
                `<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`,
                'i',
              ),
            ) ||
            html.match(
              new RegExp(
                `<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']*)["']`,
                'i',
              ),
            )
          return match ? match[1] : ''
        }
        return {
          type: 'ogp',
          title: getTag('title'),
          description: getMeta('description') || getMeta('og:description'),
          ogImage: getMeta('og:image'),
        }
      }

      const metaInfo = extractMetaInfo(html)
      return json(metaInfo)
    }
  } catch (error) {
    console.error('Error fetching or parsing URL:', error)
    return json({ error: 'Failed to fetch or parse URL' }, { status: 500 })
  }
}
