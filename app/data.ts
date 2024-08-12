import { createClient } from 'newt-client-js'

import { Article } from './types/article'

export const getArticles = async (spaceUid: string, token: string) => {
  const client = createClient({
    spaceUid,
    token,
    apiType: 'cdn',
  })

  const { items } = await client.getContents<Article>({
    appUid: 'blog',
    modelUid: 'article',
    query: {
      limit: 10,
      select: ['_id', '_sys', 'title', 'slug', 'body', 'coverImage', 'tags'],
    },
  })

  return items
}

export const getArticleBySlug = async (
  spaceUid: string,
  token: string,
  slug: string,
) => {
  const client = createClient({
    spaceUid,
    token,
    apiType: 'cdn',
  })

  const article = await client.getFirstContent<Article>({
    appUid: 'blog',
    modelUid: 'article',
    query: {
      slug,
      select: [
        '_id',
        '_sys',
        'title',
        'slug',
        'meta',
        'body',
        'coverImage',
        'tags',
      ],
    },
  })

  return article
}
