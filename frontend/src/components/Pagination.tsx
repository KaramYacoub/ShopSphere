import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-8 flex justify-center w-full">
      <Pagination className="mx-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {/* Pagination Numbers */}
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            const isCurrentPage = page === currentPage;

            const showPage =
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 2 && page <= currentPage + 2);

            if (!showPage && page === 2) {
              return (
                <PaginationItem key="ellipsis-start">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            if (!showPage && page === totalPages - 1) {
              return (
                <PaginationItem key="ellipsis-end">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            if (!showPage) return null;

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={isCurrentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
