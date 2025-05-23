import React from 'react';
import PropTypes from 'prop-types';

function ReviewSearch({ onSearch }) {
  return (
    <div className="w-full md:w-1/2">
      <form className="flex items-center" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="review-search" className="sr-only">
          Tìm kiếm
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="search"
            id="review-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
            placeholder="Tìm kiếm đánh giá..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
}

ReviewSearch.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default ReviewSearch; 