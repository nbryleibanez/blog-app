import BlogFeed from "@/components/blog-feed";

export default async function Home({ searchParams }: { searchParams: Promise<{ page: number, search: string | undefined }> }) {
  const { page, search } = await searchParams;

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <BlogFeed page={page} search={search} />
      </main>
    </div>
  );
}
