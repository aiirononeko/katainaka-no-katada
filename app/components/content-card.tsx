import { format } from '@formkit/tempo'
import { Link } from '@remix-run/react'

import { Badge } from './ui/badge'

interface Props {
  content: Blog
}

export const ContentCard = ({ content }: Props) => {
  return (
    <Link to={`/articles/${content.id}`}>
      <div className='border col-span-1 space-y-3 pb-4'>
        <img
          src={content.eyecatch.url}
          width={content.eyecatch.width}
          height={content.eyecatch.height}
        />
        <div className='px-3'>
          {content.tags.map((tag) => (
            <Badge key={tag.id} variant='outline' className='h-8 space-x-1'>
              <span>#</span>
              <span>{tag.name}</span>
            </Badge>
          ))}
        </div>
        <div className='px-4'>
          <p className='h-16 font-bold'>{content.title}</p>
          <p className='text-muted-foreground text-end tracking-wider text-sm'>
            {format(content.createdAt, 'YYYY/MM/DD')}
          </p>
        </div>
      </div>
    </Link>
  )
}
