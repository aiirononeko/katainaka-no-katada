import { format } from '@formkit/tempo'
import { MetaFunction, json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { RefreshCcw } from 'lucide-react'
import { createClient } from 'microcms-js-sdk'
import { LoaderFunctionArgs } from 'react-router'
import invariant from 'tiny-invariant'
import { ContentDetail } from '~/components/content-detail'

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

  const content = await client.get<Blog>({
    endpoint: 'blogs',
    contentId: params.contentId,
  })

  return json({ content, origin })
}

export default function Content() {
  const { content } = useLoaderData<typeof loader>()

  const publishedAt = format({
    date: content.publishedAt,
    format: 'YYYY/MM/DD',
    locale: 'ja',
    tz: 'Asia/Tokyo',
  })

  const revisedAt = format({
    date: content.revisedAt,
    format: 'YYYY/MM/DD',
    locale: 'ja',
    tz: 'Asia/Tokyo',
  })

  return (
    <article className='mb-14'>
      <header className='py-8'>
        <div className='space-y-5 container mx-auto md:space-y-6'>
          <p className='text-center'>{content.category.name}</p>
          <h1 className='text-center text-2xl font-bold leading-9 md:text-3xl'>
            {content.title}
          </h1>
          <div className='flex justify-center gap-3 text-muted-foreground text-sm'>
            <div>{publishedAt}に公開</div>
            {content.updatedAt && (
              <div className='flex items-center gap-1'>
                <RefreshCcw className='size-4' />
                {revisedAt}
              </div>
            )}
          </div>
        </div>
      </header>
      <ContentDetail content={content} />
    </article>
  )
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return []
  const { content, origin } = data

  return [
    {
      title: `${content.title} | キッサカタダ`,
    },
    {
      name: 'description',
      content: content.description,
    },
    {
      property: 'og:url',
      content: `https\://www.kissa-katada.com/${content.category.slug}/${content.id}`,
    },
    {
      property: 'og:image',
      content: `${origin}/resource/og?id=${content.id}`,
    },
    {
      property: 'og:title',
      content: content.title,
    },
    {
      property: 'og:description',
      content: content.description,
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
      content: content.title,
    },
  ]
}
