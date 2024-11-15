import Link from "next/link"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BlogPostCard({ post }: { post: any }) {
  const date = new Date(post.created_at)
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
        <CardDescription>{post.author}</CardDescription>
      </CardHeader>
      <CardContent >
        <div className="flex flex-col gap-2">
          <p>{post.content}</p>
          <div>
            <p>{formattedDate}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>
          <Link href={`/blogs/${post.id}`}>Read more</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
