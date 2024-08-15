import { Link } from '@remix-run/react'

export const Header = () => {
  return (
    <header className='h-28 flex items-center'>
      <div className='container mx-auto max-w-[1120px]'>
        <h1 className='font-bold tracking-wider text-3xl text-center'>
          <Link to='/'>キッサ カタダ</Link>
        </h1>
      </div>
    </header>
  )
}
