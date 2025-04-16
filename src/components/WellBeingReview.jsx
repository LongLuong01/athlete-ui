import React from 'react';
import AddReviewModal from "./AddReviewModal";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { wellbeingApi } from "../services/api";
import { REVIEW_MAPPINGS } from "../constants/reviewMappings";
import Toast from "./Toast";
import { useToast } from "../hooks/useToast";

export default function WellBeingReview() {
  const { user, userInfo } = useAuth();
  const athleteId = user.id;
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();
  const reviewsPerPage = 20;
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [searchParams] = useSearchParams();

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Fetch review data
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const data = await wellbeingApi.getAthleteReviews(
        athleteId,
        currentPage,
        reviewsPerPage,
        token
      );
      setReviews(data.reviews);
      setTotalReviews(data.total);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      showToast("Không thể tải dữ liệu đánh giá. Vui lòng thử lại sau.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("openModal") === "true") {
      setIsReviewModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (athleteId) {
      fetchReviews();
    }
  }, [athleteId, currentPage]);

  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const startItem = (currentPage - 1) * reviewsPerPage + 1;
  const endItem = Math.min(currentPage * reviewsPerPage, totalReviews);

  // Updated pagination generation logic
  const generatePagination = () => {
    const totalPages = Math.ceil(totalReviews / reviewsPerPage);
    let pages = [];

    if (totalPages <= 7) {
      // If total pages is less than or equal to 7, show all pages
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
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

  const paginationNumbers = generatePagination();

  return (
    <>
      {/* <div className="sm:ml-64"> */}
      <div>
        <div className="h-full mx-auto max-w-screen-xl px-3 lg:px-8 lg:py-16">
          <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label htmlFor="simple-search" className="sr-only">
                    Search
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
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 "
                      placeholder="Search"
                      required=""
                    />
                  </div>
                </form>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  type="button"
                  className="inline-flex hover:cursor-pointer text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-white-300 font-medium rounded-lg text-sm px-3 py-2 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5   "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  &nbsp;Add Review
                </button>
              </div>
            </div>

            {/* Add Review Modal */}
            {isReviewModalOpen && (
              <AddReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSuccess={() => {
                  fetchReviews();
                  setIsReviewModalOpen(false);
                  showToast("Đánh giá đã được gửi thành công!", "success");
                }}
              />
            )}

            {/* Error message */}
            {toast.show && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
              />
            )}

            {/* Loading state */}
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              /* Table */
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3">
                        Ngày tập luyện
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Mệt mỏi
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Chất lượng giấc ngủ
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Đau nhức cơ bắp
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Mức độ Stress
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Tinh thần
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Điểm đau nhức cơ bắp
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Giờ ngủ TB/ngày
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review, index) => (
                      <tr key={index} className="border-b">
                        <th
                          scope="row"
                          className="px-3 py-3 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {formatDate(review.training_date)}
                        </th>
                        <td className="px-3 py-3">
                          ({review.fatigue_level}){" "}
                          {REVIEW_MAPPINGS.fatigue_level[review.fatigue_level]}
                        </td>
                        <td className="px-3 py-3">
                          ({review.sleeping_quality}){" "}
                          {REVIEW_MAPPINGS.sleeping_quality[review.sleeping_quality]}
                        </td>
                        <td className="px-3 py-3">
                          ({review.muscle_soreness}){" "}
                          {REVIEW_MAPPINGS.muscle_soreness[review.muscle_soreness]}
                        </td>
                        <td className="px-3 py-3">
                          ({review.stress_level}){" "}
                          {REVIEW_MAPPINGS.stress_level[review.stress_level]}
                        </td>
                        <td className="px-3 py-3">
                          ({review.mental_state}){" "}
                          {REVIEW_MAPPINGS.mental_state[review.mental_state]}
                        </td>
                        <td className="px-3 py-3">{review.muscle_soreness_point}</td>
                        <td className="px-3 py-3">{review.sleep_hours} giờ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <nav className="flex items-center space-x-1 py-4 px-4 justify-end">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 ${
                  currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              {generatePagination().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-sm text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm ${
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalReviews / reviewsPerPage)))}
                disabled={currentPage === Math.ceil(totalReviews / reviewsPerPage)}
                className={`p-2 ${
                  currentPage === Math.ceil(totalReviews / reviewsPerPage)
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
