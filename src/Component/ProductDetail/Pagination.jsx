import { ChevronLeft, ChevronRight } from "lucide-react"; // Assuming you're using lucide-react for icons

const Pagination = ({ totalPage, onPageChange, page }) => {
  const handlePrevious = () => {
    if (page > 0) {
      const newPage = page - 1;
      onPageChange(newPage);
    }
  };

  const handleNext = () => {
    if (page < totalPage - 1) {
      const newPage = page + 1;
      onPageChange(newPage);
    }
  };

  return (
    <div className="flex justify-center items-center mt-6 gap-3">
      <button
        onClick={handlePrevious}
        disabled={page === 0}
        className={`flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 ease-in-out
      ${page === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    `}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>

      <span className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-50 rounded-md">
        Page {page + 1} of {totalPage}
      </span>

      <button
        onClick={handleNext}
        disabled={page === totalPage - 1}
        className={`flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 ease-in-out
      ${
        page === totalPage - 1
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer"
      }
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    `}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
