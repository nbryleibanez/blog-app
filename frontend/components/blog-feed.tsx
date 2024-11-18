import { Suspense } from "react";
import BlogPostCard from "@/components/blog-post-card";
import PaginationComponent from "@/components/pagination";

import { BlogFeedProps, Post } from "@/lib/interface";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchPosts(page?: number, search?: string) {
  const url = new URL(`${process.env.API_URL}/posts`)
  if (page) url.searchParams.append('page', page.toString())
  if (search) url.searchParams.append('search', search)

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json", },
    next: { tags: ['posts'] },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }

  return res.json()
}

export default async function BlogFeed({ page, search }: BlogFeedProps) {
  const { posts, pages, current_page } = await fetchPosts(page, search)

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post: Post) => (
          <Suspense key={post.id} fallback={<PostSkeleton />}>
            <BlogPostCard post={post} />
          </Suspense>
        ))}
      </div>
      <div>
        <PaginationComponent totalPages={pages} currentPage={current_page} />
      </div>
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}
