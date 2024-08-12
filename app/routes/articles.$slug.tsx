import { format } from '@formkit/tempo'
import { json, useLoaderData } from '@remix-run/react'
import parse from 'html-react-parser'
import { RefreshCcw } from 'lucide-react'
import { LoaderFunctionArgs } from 'react-router'
import invariant from 'tiny-invariant'
import { getArticleBySlug } from '~/data'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, '記事IDが指定されていません')

  const article = await getArticleBySlug(params.slug)
  if (!article) {
    throw new Response('Not Found', { status: 404 })
  }

  return json({ article })
}

export default function Article() {
  const { article } = useLoaderData<typeof loader>()

  return (
    <article>
      <header className='py-10 md:py-40'>
        <div className='space-y-6 px-4 md:mx-24 md:px-10'>
          <h1 className='text-center text-2xl font-bold leading-9 md:text-3xl'>
            {article.title}
          </h1>
          <div className='flex justify-center gap-3 tracking-wider text-muted-foreground'>
            <div>{format(article._sys.createdAt, 'YYYY/MM/DD')}に公開</div>
            <div className='flex items-center gap-1'>
              <RefreshCcw className='size-4' />
              {format(article._sys.updatedAt, 'YYYY/MM/DD')}
            </div>
          </div>
        </div>
      </header>
      <div>{parse(article.body)}</div>
    </article>
  )
}
