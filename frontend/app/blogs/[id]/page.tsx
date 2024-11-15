import DeletePostButton from "@/components/delete-post-button"

export default async function BlogPage({ params }: { params: { id: string } }) {
  const data = await fetch(`http://127.0.0.1:5000/posts/${params.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return (
    <div>
      <div>{data.title}</div>
      <div>{data.author}</div>
      <div>{data.content}</div>
      <DeletePostButton id={params.id} />
    </div>
  )
}
