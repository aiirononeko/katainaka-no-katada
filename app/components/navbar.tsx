import { NavLink } from '@remix-run/react'

const NAV_ITEMS = [
  {
    path: '/',
    name: 'トップ',
  },
  {
    path: '/technology',
    name: 'テクノロジー',
  },
  {
    path: '/gadget',
    name: 'ガジェット',
  },
  {
    path: '/coffee',
    name: 'コーヒー',
  },
  {
    path: '/dairy',
    name: '日々のこと',
  },
]

export const Navbar = () => {
  return (
    <nav className='h-10 mb-6 dot-font'>
      <ul className='flex justify-center font-semibold text-sm'>
        {NAV_ITEMS.map((item) => (
          <li
            key={`${item.name}_${Math.random()}`}
            className='h-12 w-32 flex items-center justify-center hover:bg-muted hover:underline'
          >
            <NavLink
              to={item.path}
              prefetch='intent'
              className={({ isActive }) => (isActive ? 'underline' : '')}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
