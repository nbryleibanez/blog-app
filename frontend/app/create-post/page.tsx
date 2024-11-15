import PostForm from "@/components/post-form";

import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreatePostPage() {

  return (
    <main className="relative flex flex-col min-h-screen items-center justify-center p-5 gap-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create a new post</CardTitle>
        </CardHeader>
        <PostForm />
      </Card>
    </main>
  );
}
