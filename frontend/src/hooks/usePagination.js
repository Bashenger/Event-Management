import { useState, useMemo, useCallback, useEffect } from 'react';

export const usePagination = (items = [], itemsPerPage = 6) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(itemsPerPage);

  // Total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((items.length || 0) / perPage));
  }, [items.length, perPage]);

  // Adjust page if items count drops below current page bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Paginated subset
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, currentPage, perPage]);

  const goToPage = useCallback(
    (page, scrollToTop = true) => {
      const targetPage = Math.max(1, Math.min(totalPages, page));
      setCurrentPage(targetPage);
      if (scrollToTop && typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    currentPage,
    totalPages,
    perPage,
    setPerPage,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    totalItems: items.length,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};
