import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Post } from "@/lib/interface"

export default function BlogPostCard({ post }: { post: Post }) {
  const date = new Date(post.created_at)
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold line-clamp-2">{post.title}</CardTitle>
        <CardDescription>By {post.author.name}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3">{post.content}</p>
        <p className="text-sm text-muted-foreground mt-2">{formattedDate}</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/blogs/${post.id}`}>Read more</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
