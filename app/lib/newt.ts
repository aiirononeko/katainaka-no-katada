import { createClient } from 'newt-client-js'

export const client = createClient({
  spaceUid: process.env.NEWT_SPACE_UID!,
  token: process.env.NEWT_CDN_API_TOKEN!,
  apiType: 'cdn',
})
