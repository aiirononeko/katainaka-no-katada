import { Await } from '@remix-run/react'
import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  domToReact,
} from 'html-react-parser'
import { children } from 'node_modules/cheerio/dist/esm/api/traversing'
import { Suspense } from 'react'
import { ErrorDisplay, LinkCard } from '~/components/link-card'
import { Skeleton } from '~/components/ui/skeleton'

export const parseContent = (content: string) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        // <p>タグを処理
        if (domNode.name === 'p') {
          const children = domNode.children
          const hasLink = children.some(
            (child) => child instanceof Element && child.name === 'a',
          )
          if (hasLink) {
            return (
              <>
                {children.map((child, index) => {
                  if (child instanceof Element && child.name === 'a') {
                    const dataPromise = fetch(
                      `http://localhost:5173/resource/link-card?url=${child.attribs.href}`,
                    ).then((response) => {
                      if (!response.ok) {
                        throw new Error(
                          `HTTP error! status: ${response.status}`,
                        )
                      }
                      return response.json()
                    })
                    return (
                      <Suspense
                        key={index}
                        fallback={
                          <Skeleton className='w-full h-24 rounded my-4' />
                        }
                      >
                        <Await
                          resolve={dataPromise}
                          errorElement={<ErrorDisplay />}
                        >
                          <LinkCard href={child.attribs.href} />
                        </Await>
                      </Suspense>
                    )
                  }
                  return domToReact([child as DOMNode], options)
                })}
              </>
            )
          }

          return (
            <p className='my-6 leading-8'>
              {domToReact(children as DOMNode[], options)}
            </p>
          )
        }

        // <ol>タグを処理
        if (domNode.name === 'ol') {
          return (
            <ol className='list-decimal ml-9 my-6 space-y-4'>
              {domToReact(domNode.children as DOMNode[], options)}
            </ol>
          )
        }

        // <ul>タグを処理
        if (domNode.name === 'ul') {
          return (
            <ol className='list-disc ml-4 my-6 space-y-4'>
              {domToReact(domNode.children as DOMNode[], options)}
            </ol>
          )
        }

        // <img>タグを処理
        if (domNode.name === 'img') {
          const { src, alt, ...props } = domNode.attribs
          return (
            <img
              src={src}
              alt={alt}
              {...props}
              className='max-w-full h-auto rounded-lg shadow-lg'
              loading='lazy'
            />
          )
        }
      }
    },
  }

  return parse(content, options)
}
