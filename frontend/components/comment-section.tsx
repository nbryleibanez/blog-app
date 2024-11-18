import { getProfile } from "@/app/actions";
import CommentForm from "@/components/comment-form"
import CommentMenuButton from "@/components/comment-menu-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CommentSectionProps {
  postId: string
}

export default async function CommentSection({ postId }: CommentSectionProps) {
  try {
    const response = await fetch(`${process.env.API_URL}/comments?post_id=${postId}`, {
      method: 'GET',
      next: { tags: ['comments'] }
    });

    if (!response.ok) {
      console.error('Error fetching comments:', response.statusText);
      return <div>Error loading comments.</div>; // Handle error gracefully
    }

    const comments = await response.json();
    const profile = await getProfile();

    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <CommentForm id={postId} />
        <div className="space-y-4">
          {comments.map((comment: any) => (
            <div key={comment.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.author_name}`} alt={comment.author_name} />
                <AvatarFallback>{comment.author_name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{comment.author_name}</h3>
                  <div className="flex items-center gap-2">
                    <time className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </time>
                    {profile && profile.id === comment.author_id && (
                      <CommentMenuButton id={comment.id} />
                    )}
                  </div>
                </div>
                <p className="mt-1 text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return <div>Error loading comments.</div>; // Handle error gracefully
  }
}
