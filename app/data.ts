import { client } from './lib/newt'
import { Article } from './types/article'

export const getArticles = async () => {
  const { items } = await client.getContents<Article>({
    appUid: 'blog',
    modelUid: 'article',
    query: {
      select: ['_id', 'title', 'slug', 'body'],
    },
  })

  return items
}

export const getArticleBySlug = async (slug: string) => {
  const article = await client.getFirstContent<Article>({
    appUid: 'blog',
    modelUid: 'article',
    query: {
      slug,
      select: ['_id', '_sys', 'title', 'slug', 'body'],
    },
  })

  return article
}
