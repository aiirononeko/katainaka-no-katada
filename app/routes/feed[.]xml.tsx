import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/cloudflare'
import { createClient } from 'microcms-js-sdk'

export const loader: LoaderFunction = async ({
  context,
}: LoaderFunctionArgs) => {
  const blogUrl = 'https://www.kissa-katada.com'

  const client = createClient({
    serviceDomain: context.cloudflare.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: context.cloudflare.env.MICROCMS_API_KEY,
  })

  const { contents } = await client.getList<Blog>({
    endpoint: 'blogs',
    queries: {
      orders: '-createdAt',
      limit: 10,
    },
  })

  const items = contents.map((content) => {
    return [
      `<item>`,
      `<title>${content.title}</title>`,
      `<pubDate>${content.revisedAt}</pubDate>`,
      `<description><![CDATA[${content.description}]]></description>`,
      `<content:encoded><![CDATA[${content.title}]]></content:encoded>`,
      `<link>${blogUrl}/${content.category.slug}/${content.id}</link>`,
      `<guid isPermaLink="false">tag:${content.revisedAt}:/${content.id}#</guid>`,
      `</item>`,
    ].join('')
  })

  const rss = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">`,
    `<channel>`,
    `<title>mersy note</title>`,
    `<description>mersy note</description>`,
    `<link>https://remix-cloudflare-workers.mersy4189618.workers.dev/</link>`,
    `<atom:link href="https://remix-cloudflare-workers.mersy4189618.workers.dev/feed.xml" rel="self" type="application/rss+xml" />`,
    `<language>ja-JP</language>`,
    ...items,
    `</channel>`,
    `</rss>`,
  ]

  return new Response(rss.join(''), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      'x-content-type-options': 'nosniff',
    },
  })
}
