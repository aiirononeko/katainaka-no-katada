import { Link } from '@remix-run/react'

export const Header = () => {
  return (
    <header className='border-b h-14 flex items-center'>
      <div className='container mx-auto max-w-[1120px]'>
        <h1 className='font-bold tracking-wider text-lg'>
          <Link to='/'>片田舎のカタダ</Link>
        </h1>
      </div>
    </header>
  )
}
