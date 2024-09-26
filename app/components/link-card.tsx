import { useAsyncValue } from '@remix-run/react'
import parse from 'html-react-parser'

interface LinkData {
  type: 'ogp' | 'twitter'
  title: string
  description: string
  ogImage: string
  twitterHtml?: string
}

export const LinkCard = ({ href }: { href: string }) => {
  const data = useAsyncValue() as LinkData

  return (
    <>
      {data.type === 'ogp' ? (
        <a
          href={href}
          target='_blank'
          className='block rounded h-28 border w-full my-4 hover:cursor-pointer'
        >
          <div className='grid grid-cols-3'>
            <div className='col-span-2 p-4 flex flex-col justify-center gap-2'>
              <p className='font-bold line-clamp-1'>{data.title}</p>
              <p className='text-sm text-gray-600 line-clamp-2 leading-1'>
                {data.description}
              </p>
            </div>
            <div className='col-span-1 max-h-28 flex justify-end'>
              <img
                src={data.ogImage}
                alt={data.title}
                className='max-h-28 object-contain pb-[2px] rounded-r'
              />
            </div>
          </div>
        </a>
      ) : (
        <a
          href={href}
          target='_blank'
          className='block p-4 rounded border w-full my-4 hover:cursor-pointer'
        >
          {parse(data.twitterHtml ?? '')}
        </a>
      )}
    </>
  )
}

export const ErrorDisplay = () => {
  const error = useAsyncValue() as Error
  return <p>Error loading link data: {error.message}</p>
}
