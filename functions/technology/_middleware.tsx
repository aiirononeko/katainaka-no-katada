import vercelOGPagesPlugin from '@cloudflare/pages-plugin-vercel-og'

interface Props {
  ogTitle: string
}

export const onRequest = vercelOGPagesPlugin<Props>({
  imagePathSuffix: '/social-image.png',
  component: ({ ogTitle }) => {
    console.log(ogTitle)
    return (
      <div
        style={{
          width: 1200,
          height: 630,
          background: 'white',
          color: 'black',
          fontFamily: 'DotGothic16',
          fontSize: 80,
          display: 'flex',
          flexFlow: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          letterSpacing: '4px',
        }}
      >
        <div
          style={{
            width: 1200,
            padding: '80px',
          }}
        >
          {ogTitle}
        </div>
        <div
          style={{
            width: 1200,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'baseline',
          }}
        >
          {/* <div */}
          {/*   style={{ */}
          {/*     paddingLeft: '80px', */}
          {/*     fontSize: '32px', */}
          {/*     textAlign: 'left', */}
          {/*   }} */}
          {/* > */}
          {/*   {format(content.createdAt, 'YYYY-MM-DD')} */}
          {/* </div> */}
          <div
            style={{
              paddingRight: '80px',
              fontSize: '48px',
              textAlign: 'right',
            }}
          >
            キッサ カタダ
          </div>
        </div>
      </div>
    )
  },
  extractors: {
    on: {
      'meta[property="og:title"]': (props) => ({
        element(element) {
          props.ogTitle = element.getAttribute('content') ?? ''
        },
      }),
    },
  },
  autoInject: {
    openGraph: true,
  },
})
