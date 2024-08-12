import type { MetaFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { Button } from '~/components/ui/button'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  return (
    <div className='p-4 font-sans'>
      <h1 className='text-3xl'>Welcome to Remix</h1>
      <Button>ボタン</Button>
      <Outlet />
    </div>
  )
}
