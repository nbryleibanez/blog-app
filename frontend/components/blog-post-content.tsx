import { Post } from "@/lib/interface"
import { getProfile } from "@/app/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import PostMenuButton from "./post-menu-button"

export default async function BlogPostContent({ postPromise }: { postPromise: Promise<Post> }) {
  const post = await postPromise
  const profile = await getProfile()

  const date = new Date(post.created_at)
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.author.name}`} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {formattedDate}
              </p>
            </div>
          </div>
          {profile && profile.id === post.author.id && (
            <PostMenuButton id={post.id} title={post.title} content={post.content} />
          )}
        </div>
      </header>
      <Separator className="my-8" />
      <div className="prose dark:prose-invert max-w-none">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
    </>
  )
}
