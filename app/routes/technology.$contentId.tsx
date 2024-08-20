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
  invariant(params.contentId, '記事IDが指定されていません')

  const client = createClient({
    serviceDomain: context.cloudflare.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: context.cloudflare.env.MICROCMS_API_KEY,
  })

  const content = await client.get<Blog>({
    endpoint: 'blogs',
    contentId: params.contentId,
  })

  const { origin } = new URL(request.url)
  const ogImageUrl = `${origin}/resource/og?id=${content.id}`

  return json({ content, ogImageUrl })
}

export default function TechnologyContent() {
  const { content } = useLoaderData<typeof loader>()

  return (
    <article className='mb-14'>
      <header className='py-8'>
        <div className='space-y-5 container mx-auto md:space-y-6'>
          <p className='text-center'>{content.category.name}</p>
          <h1 className='text-center text-2xl font-bold leading-9 md:text-3xl'>
            {content.title}
          </h1>
          <div className='flex justify-center gap-3 text-muted-foreground text-sm'>
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
      <ContentDetail content={content} />
    </article>
  )
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return []

  const { content, ogImageUrl } = data

  return [
    { title: `${content.title} | キッサカタダ` },
    {
      name: 'description',
      content: content.description,
    },
    {
      'og:url': `https\://www.kissa-katada.com/${content.category.slug}/${content.id}`,
    },
    { 'og:title': content.title },
    { 'og:description': content.description },
    { 'og:type': 'website' },
    { 'og:image': ogImageUrl },
    { 'twitter:card': 'summary_large_image' },
    { 'twitter:title': content.title },
    { 'twitter:creator': '@aiirononeko2' },
  ]
}
