import React, { useState } from "react";

const Pagination = ({ totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      if (onPageChange) onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      if (onPageChange) onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <button
        onClick={handlePrevious}
        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? "bg-green-500 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={handleNext}
        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
