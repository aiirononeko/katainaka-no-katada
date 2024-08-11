import { json, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { getArticleBySlug } from "~/data";

export const loader = async ({
  params
}: LoaderFunctionArgs) => {
  invariant(params.slug, '記事IDが指定されていません')

  const article = await getArticleBySlug(params.slug)
  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ article })
}

export default function Article() {
  const { article } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>{article.title}</h1>
    </div>
  )
}
