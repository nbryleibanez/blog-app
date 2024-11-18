"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface PaginationProps {
  totalPages: number
  currentPage: number
}

export default function PaginationComponent({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    return `/?${params.toString()}`
  }

  const handlePageChange = (page: number) => {
    router.push(buildUrl(page))
  }

  if (totalPages <= 1) {
    return null
  }

  const maxPageLinks = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxPageLinks / 2))
  let endPage = Math.min(totalPages, startPage + maxPageLinks - 1)

  if (endPage - startPage + 1 < maxPageLinks) {
    startPage = Math.max(1, endPage - maxPageLinks + 1)
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={`cursor-pointer ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
          />
        </PaginationItem>
        {[...Array(endPage - startPage + 1)].map((_, index) => {
          const pageNumber = startPage + index
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                onClick={() => handlePageChange(pageNumber)}
                isActive={pageNumber === currentPage}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        })}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            className={`cursor-pointer ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
