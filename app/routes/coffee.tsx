import { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { MetaFunction } from '@remix-run/cloudflare'
import { createClient } from 'microcms-js-sdk'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { ContentCard } from '~/components/content-card'

export const meta: MetaFunction = () => {
  return [
    { title: 'コーヒー | キッサカタダ' },
    {
      name: 'description',
      content:
        'キッサカタダへようこそ。元バリスタのマスターカタダが、コーヒーのことを雑多に呟いてます。',
    },
  ]
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const client = createClient({
    serviceDomain: context.cloudflare.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: context.cloudflare.env.MICROCMS_API_KEY,
  })

  const response = await client.getList<Blog>({
    endpoint: 'blogs',
  })
  return typedjson({ response })
}

export default function Coffee() {
  const { response } = useTypedLoaderData<typeof loader>()
  const { contents } = response

  return (
    <div className='container mx-auto w-full max-w-[1120px] py-10'>
      <div className='mb-10 space-y-4 dot-font'>
        <h2 className='text-center text-xl font-semibold tracking-wider'>
          コーヒー
        </h2>
        <p className='text-center tracking-wider'>
          元バリスタが語るコーヒー談義
        </p>
      </div>
      {contents.length > 0 ? (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        <div>
          <p className='text-muted-foreground'>記事が見つかりません</p>
        </div>
      )}
    </div>
  )
}
