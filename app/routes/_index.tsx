import { format } from '@formkit/tempo'
import { LoaderFunctionArgs } from '@remix-run/cloudflare'
import type { MetaFunction } from '@remix-run/cloudflare'
import { Await, Link, useNavigation } from '@remix-run/react'
import { createClient } from 'microcms-js-sdk'
import { Suspense } from 'react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import top from '~/image/top.png'

export const meta: MetaFunction = () => {
  return [
    { title: 'トップページ | 片田舎のカタダ' },
    { name: 'description', content: 'Welcome to Remix!' },
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

export default function Index() {
  const { response } = useTypedLoaderData<typeof loader>()
  const { contents } = response

  return (
    <div>
      <div className='flex justify-center'>
        <div className='w-full h-40 bg-muted max-w-[1920px] sm:h-80 lg:h-[520px] 2xl:h-[739px]'>
          <img
            src={top}
            loading='lazy'
            className='object-cover h-[100%] w-[100%]'
          />
        </div>
      </div>
      <div className='container mx-auto w-full max-w-[1120px] py-10'>
        {contents.length > 0 ? (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {contents.map((content) => (
              <Link to={`/articles/${content.id}`} key={content.id}>
                <div className='border col-span-1'>
                  <img
                    src={content.eyecatch.url}
                    width={content.eyecatch.width}
                    height={content.eyecatch.height}
                  />
                  <div className='p-4 space-y-2'>
                    <div>
                      {content.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant='outline'
                          className='h-8 tracking-wider'
                        >
                          # {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <p className='h-16 font-semibold'>{content.title}</p>
                    <p className='text-muted-foreground text-end tracking-wider text-sm'>
                      {format(content.createdAt, 'YYYY/MM/DD')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div>
            <p className='text-muted-foreground'>記事が見つかりません</p>
          </div>
        )}
      </div>
    </div>
  )
}
