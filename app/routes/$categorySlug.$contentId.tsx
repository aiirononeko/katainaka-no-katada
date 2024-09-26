import { format } from '@formkit/tempo'
import { MetaFunction, json } from '@remix-run/cloudflare'
import { ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react'
import { RefreshCcw } from 'lucide-react'
import { createClient } from 'microcms-js-sdk'
import { useEffect, useState } from 'react'
import { LoaderFunctionArgs } from 'react-router'
import invariant from 'tiny-invariant'
import { Introduce } from '~/components/introduce'
import { Toc } from '~/components/toc'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { parseContent } from '~/lib/parse-content.client'

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  invariant(params.categorySlug, 'カテゴリが指定されていません')
  invariant(params.contentId, '記事IDが指定されていません')

  const { origin } = new URL(request.url)

  const client = createClient({
    serviceDomain: context.cloudflare.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: context.cloudflare.env.MICROCMS_API_KEY,
  })

  const {
    id,
    title,
    description,
    publishedAt,
    revisedAt,
    category,
    tags,
    content,
  } = await client.get<Blog>({
    endpoint: 'blogs',
    contentId: params.contentId,
  })

  return json({
    id,
    categoryName: category.name,
    title,
    description,
    publishedAt,
    revisedAt,
    categorySlug: category.slug,
    tags,
    content,
    origin,
  })
}

export const clientLoader = async ({
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const { categoryName, title, publishedAt, revisedAt, tags, content } =
    await serverLoader<typeof loader>()

  const parsedContent = parseContent(content)

  const formattedPublishedAt = format({
    date: publishedAt,
    format: 'YYYY/MM/DD',
    locale: 'ja',
    tz: 'Asia/Tokyo',
  })

  const formattedRevisedAt = format({
    date: revisedAt,
    format: 'YYYY/MM/DD',
    locale: 'ja',
    tz: 'Asia/Tokyo',
  })

  return {
    categoryName,
    title,
    publishedAt: formattedPublishedAt,
    revisedAt: formattedRevisedAt,
    tags,
    content: parsedContent,
  }
}

clientLoader.hydrate = true

export default function Content() {
  const { categoryName, title, publishedAt, revisedAt, tags, content } =
    useLoaderData<typeof clientLoader>()

  const [isSp, setIsSp] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSp(window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <article className='mb-14 max-w-[1120px] mx-auto'>
      <header className='py-8'>
        <div className='space-y-5 container mx-auto md:space-y-6'>
          <p className='text-center'>{categoryName}</p>
          <h1 className='text-center text-2xl font-bold leading-10 md:text-3xl'>
            {title}
          </h1>
          <div className='flex justify-center gap-3 text-muted-foreground text-sm'>
            <div>{publishedAt}に公開</div>
            {revisedAt && (
              <div className='flex items-center gap-1'>
                <RefreshCcw className='size-4' />
                {revisedAt}
              </div>
            )}
          </div>
        </div>
      </header>
      <div className='md:container px-4 mx-auto grid grid-cols-4 gap-8 w-full relative'>
        <div className='col-span-4 sm:border rounded py-2 sm:py-6 sm:px-10 md:py-10 lg:col-span-3'>
          <div className='space-x-2'>
            {tags.map((tag) => (
              <Badge key={tag.id} variant='outline' className='h-8 space-x-1'>
                <span>#</span>
                <span>{tag.name}</span>
              </Badge>
            ))}
          </div>
          <div id='article' className='article'>
            {content}
          </div>
        </div>
        <div className='col-span-4 lg:hidden'>
          <Introduce />
        </div>
        {isSp ? (
          <Popover>
            <PopoverTrigger asChild className='fixed bottom-6 right-6'>
              <Button variant='outline' className='z-10'>
                目次
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Toc />
            </PopoverContent>
          </Popover>
        ) : (
          <div className='col-span-1 flex flex-col gap-8 relative'>
            <Introduce />
            <div className='border rounded p-5 space-y-4 sticky top-6'>
              <p className='font-bold'>目次</p>
              <Toc />
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return []
  const { id, title, description, categorySlug, origin } = data

  return [
    {
      title: `${title} | キッサカタダ`,
    },
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:url',
      content: `https\://www.kissa-katada.com/${categorySlug}/${id}`,
    },
    {
      property: 'og:image',
      content: `${origin}/resource/og?id=${id}`,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      property: 'twitter:title',
      content: title,
    },
  ]
}
