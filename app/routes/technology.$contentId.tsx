import { format } from '@formkit/tempo'
import { json, useLoaderData } from '@remix-run/react'
import { RefreshCcw } from 'lucide-react'
import { createClient } from 'microcms-js-sdk'
import { LoaderFunctionArgs } from 'react-router'
import invariant from 'tiny-invariant'
import { ContentDetail } from '~/components/content-detail'

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
