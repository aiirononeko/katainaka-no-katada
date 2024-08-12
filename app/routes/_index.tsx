import type { MetaFunction } from '@remix-run/node'
import { Link, json, useLoaderData } from '@remix-run/react'
import { getArticles } from '~/data'

export const meta: MetaFunction = () => {
  return [
    { title: 'トップページ | 片田舎のカタダ' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export const loader = async () => {
  const articles = await getArticles()
  return json({ articles })
}

export default function Index() {
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
          <p className='text-muted-foreground'>記事が見つかりません</p>
        </div>
      )}
    </div>
  )
}
