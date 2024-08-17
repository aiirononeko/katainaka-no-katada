import parse from 'html-react-parser'
import { Badge } from '~/components/ui/badge'

import { Introduce } from './introduce'

interface Props {
  content: Blog
}

export const ContentDetail = ({ content }: Props) => {
  return (
    <div className='container mx-auto grid grid-cols-4 gap-8 w-full max-w-[1120px]'>
      <div className='col-span-4 sm:border rounded py-2 sm:py-6 sm:px-10 md:py-10 lg:col-span-3'>
        <div className='space-x-2'>
          {content.tags.map((tag) => (
            <Badge key={tag.id} variant='outline' className='h-8 space-x-1'>
              <span>#</span>
              <span>{tag.name}</span>
            </Badge>
          ))}
        </div>
        <div id='article'>{parse(content.content)}</div>
      </div>
      <div className='hidden lg:col-span-1 lg:flex lg:flex-col lg:gap-8 lg:visible'>
        <Introduce />
        <div className='h-80 border rounded flex justify-center items-center'>
          <p className='text-muted-foreground'>目次準備中...</p>
        </div>
      </div>
      <div className='lg:hidden col-span-4'>
        <Introduce />
      </div>
    </div>
  )
}
