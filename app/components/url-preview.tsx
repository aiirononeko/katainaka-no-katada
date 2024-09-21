import React, { useEffect, useState } from 'react'

interface UrlMetadata {
  title: string
  description: string
  image: string
}

interface Props {
  url: URL
}

// URLメタデータを取得する関数
const fetchUrlMetadata = async (url: URL): Promise<UrlMetadata> => {
  console.log(url)
  const response = await fetch(url.href, {
    mode: 'no-cors',
  })
  console.log(response.ok)
  if (!response.ok) {
    throw new Error('Failed to fetch URL metadata')
  }
  return await response.json()
}

// プレビューカードを表示するコンポーネント
const UrlPreviewCard = ({
  metadata,
  url,
}: {
  metadata: UrlMetadata
  url: URL
}) => {
  return (
    <div className='border p-6 w-full'>
      <h2 className='text-xl font-bold'>{metadata.title}</h2>
      <p className='text-sm text-gray-600'>{metadata.description}</p>
      <img
        src={metadata.image}
        alt={metadata.title}
        className='mt-2 max-w-full h-auto'
      />
      <p className='text-xs text-gray-500 mt-2'>{url.href}</p>
    </div>
  )
}

// メインのURLプレビューコンポーネント
export const UrlPreview: React.FC<Props> = ({ url }) => {
  const [metadata, setMetadata] = useState<UrlMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchUrlMetadata(url)
        setMetadata(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [url])

  if (isLoading) {
    return <p className='text-center'>Loading URL preview...</p>
  }

  if (error) {
    return <p className='text-center text-red-500'>Error: {error.message}</p>
  }

  if (!metadata) {
    return <p className='text-center'>No preview available</p>
  }

  return <UrlPreviewCard metadata={metadata} url={url} />
}
