import { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { createClient } from 'microcms-js-sdk'

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const client = createClient({
    serviceDomain: context.cloudflare.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: context.cloudflare.env.MICROCMS_API_KEY,
  })

  const { contents: blogs } = await client.getList<Blog>({
    endpoint: 'blogs',
    queries: {
      fields: ['id', 'updatedAt', 'category.slug'],
    },
  })

  const { contents: categories } = await client.getList<Category>({
    endpoint: 'categories',
    queries: {
      fields: ['slug', 'updatedAt'],
    },
  })

  const content = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://www.kissa-katada.com/</loc>
        <lastmod>2024-08-17</lastmod>
        <priority>1.0</priority>
        <changefreq>daily</changefreq>
      </url>
  ${categories.map((category) => {
    return `
          <url>
            <loc>https://www.kissa-katada.com/${category.slug}</loc>
            <lastmod>${category.updatedAt}</lastmod>
            <priority>1.0</priority>
            <changefreq>daily</changefreq>
          </url>
        `
  })}
  ${blogs.map((blog) => {
    return `
      <url>
        <loc>https://www.kissa-katada.com/${blog.category.slug}/${blog.id}</loc>
        <lastmod>${blog.updatedAt}</lastmod>
        <priority>1.0</priority>
        <changefreq>daily</changefreq>
      </url>
    `
  })}
    </urlset>
    `

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  })
}
