import { useEffect } from 'react'
import tocbot from 'tocbot'

export const Toc = () => {
  useEffect(() => {
    tocbot.init({
      tocSelector: '.toc',
      contentSelector: '.article',
      headingSelector: 'h1, h2, h3',
      headingsOffset: 280,
      scrollSmoothOffset: -280,
    })

    return () => tocbot.destroy()
  }, [])

  return <nav className='toc' />
}
