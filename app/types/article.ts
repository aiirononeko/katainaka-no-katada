export interface Article {
  _id: string
  _sys: {
    createdAt: string
    updatedAt: string
  }
  title: string
  slug: string
  body: string
}
