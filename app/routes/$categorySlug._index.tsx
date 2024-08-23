import { LoaderFunctionArgs, json } from '@remix-run/cloudflare'
import { MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { createClient } from 'microcms-js-sdk'
import invariant from 'tiny-invariant'
import { CATEGORIES } from '~/categories'
import { ContentCard } from '~/components/content-card'

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  invariant(params.categorySlug, 'カテゴリが指定されていません')

  const client = createClient({
    serviceDomain: context.cloudflare.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: context.cloudflare.env.MICROCMS_API_KEY,
  })

  const categoryIndex = CATEGORIES.findIndex(
    (category) => category.slug === params.categorySlug,
  )
  const category = CATEGORIES[categoryIndex]

  const { contents } = await client.getList<Blog>({
    endpoint: 'blogs',
    queries: {
      orders: '-createdAt',
      filters: `category[equals]${category.id}`,
    },
  })

  return json({ contents, category })
}

export default function Index() {
  const { contents, category } = useLoaderData<typeof loader>()

  return (
    <div className='container mx-auto w-full max-w-[1120px] py-8 md:py-10'>
      <div className='mb-10 space-y-4'>
        <h2 className='text-center text-md md:text-xl font-semibold'>
          {category.name}
        </h2>
        <p className='text-center text-sm md:text-md'>{category.description}</p>
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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return []
  const { category } = data

  return [
    { title: `${category.name} | キッサカタダ` },
    {
      name: 'description',
      content: `キッサカタダへようこそ。${category.description}`,
    },
  ]
}
