// import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'
// import { format } from '@formkit/tempo'
// import { LoaderFunctionArgs } from '@remix-run/cloudflare'
// import { createClient } from 'microcms-js-sdk'
//
// const OG_IMAGE_WIDTH = 1200
// const OG_IMAGE_HEIGHT = 630
//
// const fontSans = (baseUrl: string) =>
//   fetch(new URL(`${baseUrl}/fonts/DotGothic16-Regular.ttf`)).then((res) =>
//     res.arrayBuffer(),
//   )
//
// export const loader = async ({ request, context }: LoaderFunctionArgs) => {
//   const { origin, searchParams } = new URL(request.url)
//   const id = searchParams.get('id')
//
//   if (!id) {
//     return new Response('Bad request', { status: 400 })
//   }
//
//   const fontData = await fontSans(origin)
//
//   const client = createClient({
//     serviceDomain: context.cloudflare.env.MICROCMS_SERVICE_DOMAIN,
//     apiKey: context.cloudflare.env.MICROCMS_API_KEY,
//   })
//
//   const content = await client.get<Blog>({
//     endpoint: 'blogs',
//     contentId: id,
//   })
//
//   return new ImageResponse(
//     (
//       <div
//         style={{
//           width: OG_IMAGE_WIDTH,
//           height: OG_IMAGE_HEIGHT,
//           background: 'white',
//           color: 'black',
//           fontFamily: 'DotGothic16',
//           fontSize: 80,
//           display: 'flex',
//           flexFlow: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//           letterSpacing: '4px',
//         }}
//       >
//         <div
//           style={{
//             width: OG_IMAGE_WIDTH,
//             padding: '80px',
//           }}
//         >
//           {content.title}
//         </div>
//         <div
//           style={{
//             width: OG_IMAGE_WIDTH,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'baseline',
//           }}
//         >
//           <div
//             style={{
//               paddingLeft: '80px',
//               fontSize: '32px',
//               textAlign: 'left',
//             }}
//           >
//             {format(content.createdAt, 'YYYY-MM-DD')}
//           </div>
//           <div
//             style={{
//               paddingRight: '80px',
//               fontSize: '48px',
//               textAlign: 'right',
//             }}
//           >
//             キッサ カタダ
//           </div>
//         </div>
//       </div>
//     ),
//     {
//       width: OG_IMAGE_WIDTH,
//       height: OG_IMAGE_HEIGHT,
//       fonts: [
//         {
//           name: 'DotGothic16',
//           data: fontData,
//           style: 'normal',
//         },
//       ],
//     },
//   )
// }
