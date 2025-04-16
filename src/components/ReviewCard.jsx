import React, { useState } from 'react';
import { REVIEW_MAPPINGS } from "../constants/reviewMappings";

export default function ReviewCard({ review }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const getMetricColor = (value) => {
    if (value <= 2) return "text-red-600";
    if (value === 3) return "text-yellow-500";
    return "text-green-600";
  };

  // Các chỉ số quan trọng hiển thị mặc định
  const mainMetrics = [
    {
      label: "Đau nhức cơ bắp",
      value: REVIEW_MAPPINGS.muscle_soreness[review.muscle_soreness],
      level: review.muscle_soreness,
      color: getMetricColor(review.muscle_soreness)
    },
    {
      label: "Điểm đau nhức",
      value: review.muscle_soreness_point,
      isRawValue: true
    },
    {
      label: "Giờ ngủ TB/ngày",
      value: `${review.sleep_hours} giờ`,
      isRawValue: true
    }
  ];

  const expandedMetrics = [
    {
      label: "Mệt mỏi",
      value: REVIEW_MAPPINGS.fatigue_level[review.fatigue_level],
      level: review.fatigue_level,
      color: getMetricColor(review.fatigue_level)
    },
    {
      label: "Giấc ngủ",
      value: REVIEW_MAPPINGS.sleeping_quality[review.sleeping_quality],
      level: review.sleeping_quality,
      color: getMetricColor(review.sleeping_quality)
    },
    {
      label: "Stress",
      value: REVIEW_MAPPINGS.stress_level[review.stress_level],
      level: review.stress_level,
      color: getMetricColor(review.stress_level)
    },
    {
      label: "Tinh thần",
      value: REVIEW_MAPPINGS.mental_state[review.mental_state],
      level: review.mental_state,
      color: getMetricColor(review.mental_state)
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      {/* Header với ngày và nút expand */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold text-gray-900">
          {formatDate(review.training_date)}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            className={`h-6 w-6 transform transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Các chỉ số chính luôn hiển thị */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {mainMetrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="text-sm text-gray-500">{metric.label}</div>
            <div className={`font-medium ${metric.isRawValue ? '' : metric.color}`}>
              {metric.isRawValue ? (
                metric.value
              ) : (
                <>({metric.level}) {metric.value}</>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chi tiết mở rộng */}
      {isExpanded && (
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {expandedMetrics.map((metric, index) => (
              <div key={index}>
                <div className="text-sm text-gray-500">{metric.label}</div>
                <div className={`font-medium ${metric.color}`}>
                  ({metric.level}) {metric.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 