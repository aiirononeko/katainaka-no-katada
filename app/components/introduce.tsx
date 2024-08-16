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
          <div className='flex flex-row gap-2'>
            <Link to='https://github.com/aiirononeko' target='_blank'>
              <img src={github} width='18px' height='18px' />
            </Link>
            <Link to='https://x.com/aiirononeko2' target='_blank'>
              <img src={x} width='18px' height='18px' />
            </Link>
          </div>
        </div>
      </div>
      <div className='py-1'>
        <p className='tracking-wider'>
          キッサカタダマスター兼フロントエンド寄りのソフトウェアエンジニア。
        </p>
        <p className='tracking-wider'>多趣味に生きてます。</p>
      </div>
    </div>
  )
}
