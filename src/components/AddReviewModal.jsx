import React, { useState } from "react";

const AddReviewModal = ({ isOpen, onClose, setReviews }) => {
  const today = new Date()
    .toLocaleDateString("en-GB")
    .split("/")
    .reverse()
    .join("-");
  const [selectedDate, setSelectedDate] = useState(today);
  const [ratings, setRatings] = useState({
    muscle_soreness_point: "",
    sleep_hours: "",
    fatigue_level: "",
    sleeping_quality: "",
    muscle_soreness: "",
    stress_level: "",
    mental_state: "",
  });

    const reviewMapping = {
    fatigue_level: {
      5: "Nhiều năng lượng",
      4: "Năng lượng",
      3: "Bình thường",
      2: "Mệt mỏi hơn bình thường",
      1: "Luôn cảm thấy mệt mỏi"
    },
    sleeping_quality: {
      5: "Rất tốt",
      4: "Tốt",
      3: "Khó vào giấc",
      2: "Ngủ không sâu",
      1: "Mất ngủ"
    },
    muscle_soreness: {
      5: "Cảm giác tốt",
      4: "Cảm giác ổn",
      3: "Bình thường",
      2: "Căng mỏi nhẹ",
      1: "Rất căng mỏi (đau)"
    },
    stress_level: {
      5: "Rất thư giãn",
      4: "Thư giãn",
      3: "Bình thường",
      2: "Cảm giác hơi stress",
      1: "Rất stress"
    },
    mental_state: {
      5: "Rất phấn chấn",
      4: "Cảm thấy ổn",
      3: "Ít hứng thú tập luyện",
      2: "Dễ khó chịu với mọi người",
      1: "Rất khó chịu với mọi người"
    }
  };

  const handleRatingChange = (category, value) => {
    setRatings({ ...ratings, [category]: value });
  };

  const handleBackgroundClick = (e) => {
    if (e.target.id === "modal-background") {
      onClose();
    }
  };

  const handleSubmit = async () => {
    // alert("Lưu đánh giá thành công!");
    // onClose();
    const reviewData = {
      athlete_id: 1,
      training_date: selectedDate,
      muscle_soreness_point: ratings.muscle_soreness_point,
      sleep_hours: ratings.sleep_hours,
      fatigue_level: ratings.fatigue_level,
      sleeping_quality: ratings.sleeping_quality,
      muscle_soreness: ratings.muscle_soreness,
      stress_level: ratings.stress_level,
      mental_state: ratings.mental_state,
    };
    console.log(reviewData)
    try {
      const response = await fetch("http://localhost:5000/api/wellbeing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });
      if (response.ok) {
        alert("Lưu đánh giá thành công!");
        setReviews((prevReviews) => [reviewData, ...prevReviews]);
        onClose();
      } else {
        alert("Lỗi khi lưu đánh giá!");
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="overflow-auto fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-2 p-2">Thêm đánh giá</h2>

        {/* Ngày tập luyện */}
        <div className="mb-2 p-2">
          <label className="block font-medium">Ngày tập luyện</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Điểm mệt mỏi */}
        <div className="mb-2 p-2">
          <label className="block font-medium">Điểm mệt mỏi</label>
          <input
            className="w-full p-2 border rounded"
            value={ratings.muscle_soreness_point}
            onChange={(e) => handleRatingChange("muscle_soreness_point", e.target.value)}
          >
            {/* <option value="">Chọn điểm</option>
            {[...Array(11).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))} */}
          </input>
        </div>

        {/* Số giờ ngủ trung bình */}
        <div className="mb-2 p-2">
          <label className="block font-medium">Số giờ ngủ trung bình</label>
          <select
            className="w-full p-2 border rounded"
            value={ratings.sleep_hours}
            onChange={(e) => handleRatingChange("sleep_hours", e.target.value)}
          >
            <option value="">Chọn số giờ</option>
            {[...Array(25).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Radio Buttons */}
        <div>
          {[
            { name: "fatigue_level", label: "Mệt mỏi" },
            { name: "sleeping_quality", label: "Chất lượng giấc ngủ" },
            { name: "muscle_soreness", label: "Đau nhức cơ bắp" },
            { name: "stress_level", label: "Mức độ stress" },
            { name: "mental_state", label: "Tinh thần" },
          ].map((item) => (
            <div key={item.name} className="mb-2 p-2">
              <label className="block font-medium mb-1">{item.label}</label>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                {[1, 2, 3, 4, 5
                ].map((option, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={item.name}
                      value={option}
                      className="form-radio text-gray-600"
                      checked={ratings[item.name] === option}
                      onChange={() => handleRatingChange(item.name, option)}
                    />
                    <span>{option} - {reviewMapping[item.name][option]}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="hover:cursor-pointer hover:bg-gray-300 px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Hủy
          </button>
          <button className="px-4 py-2 bg-blue-500 hover:cursor-pointer hover:bg-blue-600 text-white rounded" onClick={handleSubmit}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;
