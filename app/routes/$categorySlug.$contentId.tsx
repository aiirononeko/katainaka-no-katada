import { format } from '@formkit/tempo'
import { MetaFunction, json } from '@remix-run/cloudflare'
import { Await, useLoaderData } from '@remix-run/react'
import { RefreshCcw } from 'lucide-react'
import { createClient } from 'microcms-js-sdk'
import { Suspense } from 'react'
import { LoaderFunctionArgs } from 'react-router'
import invariant from 'tiny-invariant'
import { ContentDetail } from '~/components/content-detail'
import { generateUrlPreview } from '~/utils/generate-url-preview.server'

// interface LoaderData {
//   id: string
//   categoryName: string
//   title: string
//   publishedAt: string
//   revisedAt: string
//   description: string
//   categorySlug: string
//   tags: Tag[]
//   content: Promise<string>
// }

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

export default function Content() {
  const { categoryName, title, publishedAt, revisedAt, tags, content } =
    useLoaderData<typeof loader>()

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

  return (
    <article className='mb-14 max-w-[1120px] mx-auto'>
      <header className='py-8'>
        <div className='space-y-5 container mx-auto md:space-y-6'>
          <p className='text-center'>{categoryName}</p>
          <h1 className='text-center text-2xl font-bold leading-10 md:text-3xl'>
            {title}
          </h1>
          <div className='flex justify-center gap-3 text-muted-foreground text-sm'>
            <div>{formattedPublishedAt}に公開</div>
            {revisedAt && (
              <div className='flex items-center gap-1'>
                <RefreshCcw className='size-4' />
                {formattedRevisedAt}
              </div>
            )}
          </div>
        </div>
      </header>
      {/* <Suspense */}
      {/*   fallback={<p className='text-center'>Loading URL preview...</p>} */}
      {/* > */}
      {/*   <Await */}
      {/*     resolve={content} */}
      {/*     errorElement={<p>Error loading URL preview.</p>} */}
      {/*   > */}
      {/* {(resolvedContent) => ( */}
      <ContentDetail tags={tags} content={content} />
      {/* )} */}
      {/*   </Await> */}
      {/* </Suspense> */}
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
