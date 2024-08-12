export interface Article {
  _id: string
  _sys: {
    createdAt: string
    updatedAt: string
  }
  title: string
  slug: string
  meta: any
  body: string
  coverImage: any
  tags: [
    {
      id: string
      _sys: Object
      name: string
      slug: string
    },
  ]
}
