import { format } from '@formkit/tempo'
import { Link, json, useLoaderData } from '@remix-run/react'
import parse from 'html-react-parser'
import { RefreshCcw } from 'lucide-react'
import { createClient } from 'microcms-js-sdk'
import { LoaderFunctionArgs } from 'react-router'
import invariant from 'tiny-invariant'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import github from '~/image/github-icon.png'
import x from '~/image/x-icon.png'

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  invariant(params.contentId, '記事IDが指定されていません')

  const { env } = context.cloudflare

  const client = createClient({
    serviceDomain: env.MICROCMS_SERVICE_DOMAIN,
    apiKey: env.MICROCMS_API_KEY,
  })

  const content = await client.get<Blog>({
    endpoint: 'blogs',
    contentId: params.contentId,
  })
  return json({ content })
}

export default function Article() {
  const { content } = useLoaderData<typeof loader>()

  return (
    <article id='article' className='mb-14'>
      <header className='py-10 md:py-16'>
        <div className='space-y-5 container mx-auto md:space-y-6'>
          <p className='text-center'>{content.category.name}</p>
          <h1 className='text-center text-2xl font-bold leading-9 md:text-3xl'>
            {content.title}
          </h1>
          <div className='flex justify-center gap-3 tracking-wider text-muted-foreground text-sm'>
            <div>{format(content.createdAt, 'YYYY/MM/DD')}に公開</div>
            {content.updatedAt && (
              <div className='flex items-center gap-1'>
                <RefreshCcw className='size-4' />
                {format(content.updatedAt, 'YYYY/MM/DD')}
              </div>
            )}
          </div>
        </div>
      </header>
      <div className='container mx-auto grid grid-cols-4 gap-8 w-full max-w-[1120px]'>
        <div className='col-span-4 border rounded container py-10 lg:col-span-3'>
          <div>
            {content.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant='outline'
                className='h-8 hover:underline'
              >
                <Link to={`/articles?tag=${tag.id}`} className='tracking-wider'>
                  # {tag.name}
                </Link>
              </Badge>
            ))}
          </div>
          <div className='mt-6'>
            <img src={content.eyecatch.url} loading='lazy' />
          </div>
          {parse(content.content)}
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
