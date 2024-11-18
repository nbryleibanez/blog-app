import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import BlogPostContent from '@/components/blog-post-content'
import CommentSection from '@/components/comment-section'

import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

async function getBlogPost(id: string) {
  const res = await fetch(`${process.env.API_URL}/posts/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 }, // Revalidate every minute
  })

  if (!res.ok) {
    if (res.status === 404) {
      notFound()
    }
    throw new Error('Failed to fetch blog post')
  }

  return res.json()
}

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postPromise = getBlogPost(id)

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <Suspense fallback={<BlogPostSkeleton />}>
        <BlogPostContent postPromise={postPromise} />
      </Suspense>
      <Separator />
      <CommentSection postId={id} />
    </article>
  )
}

function BlogPostSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-40 w-full" /> {/* Added for comment section */}
    </div>
  )
}
