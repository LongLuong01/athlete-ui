import React from 'react';
import PropTypes from 'prop-types';
import { REVIEW_MAPPINGS } from '../../constants/reviewMappings';

function ReviewTable({ reviews, formatDate }) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-3">Ngày tập luyện</th>
            <th scope="col" className="px-3 py-3">Mệt mỏi</th>
            <th scope="col" className="px-3 py-3">Chất lượng giấc ngủ</th>
            <th scope="col" className="px-3 py-3">Đau nhức cơ bắp</th>
            <th scope="col" className="px-3 py-3">Mức độ Stress</th>
            <th scope="col" className="px-3 py-3">Tinh thần</th>
            <th scope="col" className="px-3 py-3">Điểm đau nhức cơ bắp</th>
            <th scope="col" className="px-3 py-3">Giờ ngủ TB/ngày</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <th scope="row" className="px-3 py-3 font-medium text-gray-900 whitespace-nowrap">
                {formatDate(review.training_date)}
              </th>
              <td className="px-3 py-3">
                ({review.fatigue_level}) {REVIEW_MAPPINGS.fatigue_level[review.fatigue_level]}
              </td>
              <td className="px-3 py-3">
                ({review.sleeping_quality}) {REVIEW_MAPPINGS.sleeping_quality[review.sleeping_quality]}
              </td>
              <td className="px-3 py-3">
                ({review.muscle_soreness}) {REVIEW_MAPPINGS.muscle_soreness[review.muscle_soreness]}
              </td>
              <td className="px-3 py-3">
                ({review.stress_level}) {REVIEW_MAPPINGS.stress_level[review.stress_level]}
              </td>
              <td className="px-3 py-3">
                ({review.mental_state}) {REVIEW_MAPPINGS.mental_state[review.mental_state]}
              </td>
              <td className="px-3 py-3">{review.muscle_soreness_point}</td>
              <td className="px-3 py-3">{review.sleep_hours} giờ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ReviewTable.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      training_date: PropTypes.string.isRequired,
      fatigue_level: PropTypes.number.isRequired,
      sleeping_quality: PropTypes.number.isRequired,
      muscle_soreness: PropTypes.number.isRequired,
      stress_level: PropTypes.number.isRequired,
      mental_state: PropTypes.number.isRequired,
      muscle_soreness_point: PropTypes.string.isRequired,
      sleep_hours: PropTypes.number.isRequired
    })
  ).isRequired,
  formatDate: PropTypes.func.isRequired
};

export default ReviewTable; 