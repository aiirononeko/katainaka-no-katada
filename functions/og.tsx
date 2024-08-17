import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'

export const onRequest: PagesFunction = async (context) => {
  const parsedUrl = new URL(context.request.url)
  const title = parsedUrl.searchParams.get('title')

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <h1
          style={{
            fontSize: '72px',
            padding: '40px',
          }}
        >
          {title}
        </h1>
        <h2
          style={{
            fontSize: '40px',
            position: 'absolute',
            bottom: '0px',
            right: '40px',
          }}
        >
          キッサ カタダ
        </h2>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
