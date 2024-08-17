import { Link } from '@remix-run/react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import github from '~/image/github-icon.png'
import avatar from '~/image/katada-avatar.png'
import x from '~/image/x-icon.png'

export const Introduce = () => {
  return (
    <div className='border rounded p-5 space-y-4'>
      <div className='flex flex-row gap-3'>
        <Avatar>
          <AvatarImage src={avatar} alt='カタダリョウタのアイコン' />
          <AvatarFallback>RK</AvatarFallback>
        </Avatar>
        <div className='space-y-2'>
          <p className='font-bold tracking-wider'>カタダ リョウタ</p>
          <div className='flex flex-row gap-2 items-baseline'>
            <Link to='https://github.com/aiirononeko' target='_blank'>
              <img src={github} width='24px' height='24px' />
            </Link>
            <Link to='https://x.com/aiirononeko2' target='_blank'>
              <img src={x} width='20px' height='20px' />
            </Link>
          </div>
        </div>
      </div>
      <div className='py-1'>
        <p className='tracking-wider text-sm leading-6'>
          キッサカタダマスター兼フロントエンド寄りのソフトウェアエンジニア。
        </p>
        <p className='tracking-wider text-sm leading-6'>多趣味に生きてます。</p>
      </div>
    </div>
  )
}
