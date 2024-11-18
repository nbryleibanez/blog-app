export interface BlogFeedProps {
  page?: number;
  search?: string;
}

export interface Post {
  id: number
  title: string
  author: {
    id: number
    name: string
    username: string
  }
  content: string
  created_at: string
}

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
}
