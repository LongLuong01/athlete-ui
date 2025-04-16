import React, { useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AddReviewModal from "../components/AddReviewModal";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import EmptyState from "../components/EmptyState";
import TableSkeleton from "../components/TableSkeleton";
import ReviewCard from "../components/ReviewCard";
import { wellbeingApi } from '../services/api';
import ReviewTable from '../components/review/ReviewTable';
import ReviewSearch from '../components/review/ReviewSearch';
import ReviewPagination from '../components/review/ReviewPagination';
import { REVIEW_MAPPINGS } from '../constants/reviewMappings';

export default function WellBeingReview() {
  const { user } = useAuth();
  const athleteId = user.id;
  const [searchParams] = useSearchParams();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reviewsPerPage = 30;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
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
      setError("Không thể tải dữ liệu đánh giá. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (athleteId) {
      fetchReviews();
    }
  }, [athleteId, currentPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handle search (to be implemented)
  const handleSearch = (query) => {
    console.log('Search query:', query);
  };

  return (
    <div>
      <div className="h-full mx-auto max-w-screen-xl px-3 lg:px-8 lg:py-16">
        <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <ReviewSearch onSearch={handleSearch} />
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <button
                onClick={() => setIsReviewModalOpen(true)}
                type="button"
                className="inline-flex items-center justify-center hover:cursor-pointer text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-white-300 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Thêm đánh giá
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

          {/* Toast */}
          {toast.show && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={hideToast}
            />
          )}

          {/* Content */}
          {isLoading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : reviews.length === 0 ? (
            <EmptyState onAddReview={() => setIsReviewModalOpen(true)} />
          ) : (
            <>
              {/* Desktop Table View */}
              <ReviewTable reviews={reviews} formatDate={formatDate} />

              {/* Mobile Card View */}
              <div className="md:hidden px-4">
                {reviews.map((review, index) => (
                  <ReviewCard key={index} review={review} />
                ))}
              </div>

              {/* Pagination */}
              {reviews.length > 0 && (
                <ReviewPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 