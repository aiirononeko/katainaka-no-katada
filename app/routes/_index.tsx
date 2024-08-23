import { LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import type { MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { createClient } from 'microcms-js-sdk'
import { ContentCard } from '~/components/content-card'

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const client = createClient({
    serviceDomain: context.cloudflare.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: context.cloudflare.env.MICROCMS_API_KEY,
  })

  const response = await client.getList<Blog>({
    endpoint: 'blogs',
    queries: {
      orders: '-createdAt',
    },
  })
  return json({ response })
}

export default function Index() {
  const { response } = useLoaderData<typeof loader>()
  const { contents } = response

  return (
    <div className='container mx-auto w-full max-w-[1120px] py-8 md:py-10'>
      <div className='mb-10 space-y-10'>
        <div className='mb-10 space-y-4'>
          <h2 className='text-center md:text-xl font-semibold'>最新記事</h2>
          <p className='text-center text-sm md:text-md'>
            マスターカタダおすすめの記事をご覧ください
          </p>
        </div>
      </div>
      {contents.length > 0 ? (
        <div className='grid lg:grid-cols-3 gap-8 justify-center'>
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        <div>
          <p className='text-muted-foreground text-center'>
            記事が見つかりません
          </p>
        </div>
      )}
    </div>
  )
}

export const meta: MetaFunction = () => {
  return [
    { title: 'トップページ | キッサカタダ' },
    {
      name: 'description',
      content:
        'キッサカタダへようこそ。キッサカタダマスター兼ソフトウェアエンジニアのカタダが技術や趣味のことを記事にしています。',
    },
    {
      property: 'og:url',
      content: 'https://www.kissa-katada.com',
    },
    {
      property: 'og:image',
      content: '',
    },
    {
      property: 'og:title',
      content: 'トップページ | キッサカタダ',
    },
    {
      property: 'og:description',
      content:
        'キッサカタダへようこそ。キッサカタダマスター兼ソフトウェアエンジニアのカタダが技術や趣味のことを記事にしています。',
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
      content: 'トップページ | キッサカタダ',
    },
  ]
}
