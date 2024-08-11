import { json, Link, useLoaderData } from "@remix-run/react"
import { getArticles } from "~/data"

export const loader = async () => {
  const articles = await getArticles()
  return json({ articles })
}

export default function Articles() {
  const { articles } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>すべての記事</h1>
      {articles.length > 0 ? (
        <div>
          {articles.map((article) => (
            <div key={article._id}>
              <Link to={`/articles/${article.slug}`}>{article.title}</Link>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>記事が見つかりません</p>
        </div>
      )}
    </div>
  )
}
