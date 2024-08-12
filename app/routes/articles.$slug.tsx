import { format } from '@formkit/tempo'
import { Link, json, useLoaderData } from '@remix-run/react'
import parse from 'html-react-parser'
import { RefreshCcw } from 'lucide-react'
import { LoaderFunctionArgs } from 'react-router'
import invariant from 'tiny-invariant'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { getArticleBySlug } from '~/data'
import github from '~/image/github-icon.png'
import x from '~/image/x-icon.png'

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  invariant(params.slug, '記事IDが指定されていません')

  const { env } = context.cloudflare

  const article = await getArticleBySlug(
    env.NEWT_SPACE_UID,
    env.NEWT_CDN_API_TOKEN,
    params.slug,
  )
  if (!article) {
    throw new Response('Not Found', { status: 404 })
  }

  return json({ article })
}

export default function Article() {
  const { article } = useLoaderData<typeof loader>()

  return (
    <article className='mb-14'>
      <header className='py-10 md:py-16'>
        <div className='space-y-6 container mx-auto'>
          <h1 className='text-center text-2xl font-bold leading-9 md:text-3xl'>
            {article.title}
          </h1>
          <div className='flex justify-center gap-3 tracking-wider text-muted-foreground text-sm'>
            <div>{format(article._sys.createdAt, 'YYYY/MM/DD')}に公開</div>
            {article._sys.updatedAt && (
              <div className='flex items-center gap-1'>
                <RefreshCcw className='size-4' />
                {format(article._sys.updatedAt, 'YYYY/MM/DD')}
              </div>
            )}
          </div>
        </div>
      </header>
      <div className='container mx-auto grid grid-cols-4 gap-8 w-full max-w-[1120px]'>
        <div className='col-span-4 border rounded container py-10 lg:col-span-3'>
          <div>
            {article.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant='outline'
                className='h-8 hover:underline'
              >
                <Link
                  to={`/articles?tag=${tag.slug}`}
                  className='tracking-wider'
                >
                  # {tag.name}
                </Link>
              </Badge>
            ))}
          </div>
          <div className='mt-6'>
            <img src={article.coverImage.src} loading='lazy' />
          </div>
          {parse(article.body)}
        </div>
        <div className='hidden lg:col-span-1 lg:flex lg:flex-col lg:gap-8 lg:visible'>
          <div className='border rounded p-5 space-y-4'>
            <div className='flex flex-row gap-3'>
              <Avatar>
                <AvatarImage alt='カタダリョウタのアイコン' />
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div>
                <p className='font-bold'>カタダ リョウタ</p>
                <div className='flex flex-row gap-2'>
                  <Link to='https://github.com/aiirononeko' target='_blank'>
                    <img src={github} width='18px' height='18px' />
                  </Link>
                  <Link to='https://x.com/aiirononeko2' target='_blank'>
                    <img src={x} width='18px' height='18px' />
                  </Link>
                </div>
              </div>
            </div>
            <div className='space-y-2'>
              <p className='text-sm'>ソフトウェアエンジニア</p>
              <p className='text-sm'>多趣味に生きてます</p>
            </div>
          </div>
          <div className='h-80 border rounded flex justify-center items-center'>
            <p className='text-muted-foreground'>目次準備中...</p>
          </div>
        </div>
      </div>
    </article>
  )
}
