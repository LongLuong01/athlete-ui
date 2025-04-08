import AddReviewModal from "./AddReviewModal";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";


export default function WellBeingReview() {
  const { user } = useContext(AuthContext);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const athleteId = user.id;
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng được tính từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const reviewMapping = {
    fatigue_level: {
      5: "Nhiều năng lượng",
      4: "Năng lượng",
      3: "Bình thường",
      2: "Mệt mỏi hơn bình thường",
      1: "Luôn cảm thấy mệt mỏi",
    },
    sleeping_quality: {
      5: "Rất tốt",
      4: "Tốt",
      3: "Khó vào giấc",
      2: "Ngủ không sâu",
      1: "Mất ngủ",
    },
    muscle_soreness: {
      5: "Cảm giác tốt",
      4: "Cảm giác ổn",
      3: "Bình thường",
      2: "Căng mỏi nhẹ",
      1: "Rất căng mỏi (đau)",
    },
    stress_level: {
      5: "Rất thư giãn",
      4: "Thư giãn",
      3: "Bình thường",
      2: "Cảm giác hơi stress",
      1: "Rất stress",
    },
    mental_state: {
      5: "Rất phấn chấn",
      4: "Cảm thấy ổn",
      3: "Ít hứng thú tập luyện",
      2: "Dễ khó chịu với mọi người",
      1: "Rất khó chịu với mọi người",
    },
  };

  // Fetch review data của athlete
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/wellbeing/athlete?athlete_id=${athleteId}&page=${currentPage}&limit=${reviewsPerPage}`
      );
      const data = await response.json();
      setReviews(data.reviews);
      setTotalReviews(data.total);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    if (athleteId) {
      fetchReviews();
    }
  }, [user, currentPage]);

  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const startItem = (currentPage - 1) * reviewsPerPage + 1;
  const endItem = Math.min(currentPage * reviewsPerPage, totalReviews);

  // Hàm tạo danh sách số trang với `...` khi cần
  const generatePagination = () => {
    let pages = [];
    if (totalPages <= 7) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 4) {
        pages = [1, 2, 3, 4, "...", totalPages];
      } else if (currentPage >= totalPages - 3) {
        pages = [
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
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
            {isReviewModalOpen && (
              <AddReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                setReviews={setReviews} // Truyền hàm cập nhật danh sách
                athleteId={athleteId} // Truyền athleteId vào modal
              />
            )}

            {/* Table */}
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
                        className="px-3 py-3 font-medium text-gray-900 whitespace-nowrap "
                      >
                        {formatDate(review.training_date)}
                      </th>
                      <td className="px-3 py-3">
                        ({review.fatigue_level}){" "}
                        {reviewMapping.fatigue_level[review.fatigue_level]}
                      </td>
                      <td className="px-3 py-3">
                        ({review.sleeping_quality}){" "}
                        {
                          reviewMapping.sleeping_quality[
                            review.sleeping_quality
                          ]
                        }
                      </td>
                      <td className="px-3 py-3">
                        ({review.muscle_soreness}){" "}
                        {reviewMapping.muscle_soreness[review.muscle_soreness]}
                      </td>
                      <td className="px-3 py-3">
                        ({review.stress_level}){" "}
                        {reviewMapping.stress_level[review.stress_level]}
                      </td>
                      <td className="px-3 py-3">
                        ({review.mental_state}){" "}
                        {reviewMapping.mental_state[review.mental_state]}
                      </td>
                      <td className="px-3 py-3">
                        {review.muscle_soreness_point}
                      </td>
                      <td className="px-3 py-3">{review.sleep_hours} giờ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav
              className="flex flex-col md:flex-row justify-between items-center p-4"
              aria-label="Table navigation"
            >
              <span className="text-sm font-normal text-gray-500">
                Showing
                <span className="font-semibold text-gray-900">
                  {" "}
                  {startItem}-{endItem}{" "}
                </span>
                of
                <span className="font-semibold text-gray-900">
                  {" "}
                  {totalReviews}{" "}
                </span>
              </span>

              <div className="flex items-center space-x-1">
                {/* Nút Previous */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={`px-3 py-1 border rounded ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                {/* Hiển thị danh sách số trang */}
                {paginationNumbers.map((num, index) => (
                  <button
                    key={index}
                    onClick={() => num !== "..." && setCurrentPage(num)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === num
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {num}
                  </button>
                ))}

                {/* Nút Next */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={`px-3 py-1 border rounded ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
