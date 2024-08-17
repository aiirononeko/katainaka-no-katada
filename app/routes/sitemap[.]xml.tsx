export const loader = () => {
  const content = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://www.kissa-katada.com/</loc>
        <lastmod>2024-08-17</lastmod>
        <priority>1.0</priority>
        <changefreq>daily</changefreq>
      </url>
      <url>
        <loc>https://www.kissa-katada.com/daily</loc>
        <lastmod>2024-08-17</lastmod>
        <priority>1.0</priority>
        <changefreq>daily</changefreq>
      </url>
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
