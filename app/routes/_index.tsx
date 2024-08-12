import { format } from '@formkit/tempo'
import type { MetaFunction } from '@remix-run/node'
import { Link, json, useLoaderData } from '@remix-run/react'
import { Badge } from '~/components/ui/badge'
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
    <div className='container mx-auto w-full max-w-[1120px] py-10'>
      {articles.length > 0 ? (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {articles.map((article) => (
            <Link to={`/articles/${article.slug}`} key={article._id}>
              <div className='border col-span-1'>
                <img src={article.coverImage.src} />
                <div className='p-4 space-y-2'>
                  <div>
                    {article.tags.map((tag) => (
                      <Badge key={tag.id} variant='outline' className='h-8'>
                        # {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <p className='h-16 font-semibold'>{article.title}</p>
                  <p className='text-muted-foreground text-end tracking-wider text-sm'>
                    {format(article._sys.createdAt, 'YYYY/MM/DD')}
                  </p>
                </div>
              </div>
            </Link>
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
