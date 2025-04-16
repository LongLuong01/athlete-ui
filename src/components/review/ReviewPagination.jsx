import React from 'react';
import PropTypes from 'prop-types';

function ReviewPagination({ currentPage, totalPages, onPageChange }) {
  const generatePagination = () => {
    const pages = [];

    if (totalPages <= 7) {
      // If total pages is less than or equal to 7, show all pages
      pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 4) {
        // If current page is among first 4 pages
        pages.push(2, 3, 4, 5);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // If current page is among last 4 pages
        pages.push('...');
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // If current page is in the middle
        pages.push('...');
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <nav className="flex items-center space-x-1 py-4 px-4 justify-end">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`p-2 ${
          currentPage === 1 
          ? 'text-gray-300 cursor-not-allowed' 
          : 'text-gray-500 hover:text-gray-700'
        }`}
        title="Previous page"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      {generatePagination().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-sm text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`min-w-[2.5rem] h-10 ${
                currentPage === page
                  ? 'bg-blue-500 text-white rounded'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`p-2 ${
          currentPage === totalPages
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-500 hover:text-gray-700'
        }`}
        title="Next page"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </nav>
  );
}

ReviewPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default ReviewPagination; 