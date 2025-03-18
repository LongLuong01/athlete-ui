import React, { useState } from "react";

const AddReviewModal = ({ isOpen, onClose }) => {
  const today = new Date().toLocaleDateString("en-GB").split("/").reverse().join("-");
  const [selectedDate, setSelectedDate] = useState(today);
  const [ratings, setRatings] = useState({
    diemMetMoi: "",
    soGioNgu: "",
    metMoi: "",
    chatLuongGiacNgu: "",
    dauNhucCoBap: "",
    stress: "",
    tinhThan: "",
  });

  const handleRatingChange = (category, value) => {
    setRatings({ ...ratings, [category]: value });
  };

  const handleBackgroundClick = (e) => {
    if (e.target.id === "modal-background") {
      onClose();
    }
  };

  return (
    <div className="overflow-auto fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Thêm đánh giá</h2>
        
        {/* Ngày tập luyện */}
        <div className="mb-4">
          <label className="block font-medium">Ngày tập luyện</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Điểm mệt mỏi */}
        <div className="mb-4">
          <label className="block font-medium">Điểm mệt mỏi</label>
          <select
            className="w-full p-2 border rounded"
            value={ratings.diemMetMoi}
            onChange={(e) => handleRatingChange("diemMetMoi", e.target.value)}
          >
            <option value="">Chọn điểm</option>
            {[...Array(11).keys()].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Số giờ ngủ trung bình */}
        <div className="mb-4">
          <label className="block font-medium">Số giờ ngủ trung bình</label>
          <select
            className="w-full p-2 border rounded"
            value={ratings.soGioNgu}
            onChange={(e) => handleRatingChange("soGioNgu", e.target.value)}
          >
            <option value="">Chọn số giờ</option>
            {[...Array(25).keys()].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Radio Buttons */}
        {[
          { name: "metMoi", label: "Mệt mỏi" },
          { name: "chatLuongGiacNgu", label: "Chất lượng giấc ngủ" },
          { name: "dauNhucCoBap", label: "Đau nhức cơ bắp" },
          { name: "stress", label: "Stress" },
          { name: "tinhThan", label: "Tinh thần" },
        ].map((item) => (
          <div key={item.name} className="mb-4">
            <label className="block font-medium mb-1">{item.label}</label>
            <div className="flex flex-col sm:flex-row sm:gap-4">
              {["1. Rất mệt", "2. Mệt", "3. Bình thường", "4. Cảm thấy khỏe", "5. Khỏe"].map((option, index) => (
                <label key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={item.name}
                    value={option}
                    className="form-radio text-gray-600"
                    checked={ratings[item.name] === option}
                    onChange={() => handleRatingChange(item.name, option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button className="hover:cursor-pointer hover:bg-gray-300 px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Hủy</button>
          <button className="px-4 py-2 bg-blue-500 hover:cursor-pointer hover:bg-blue-600 text-white rounded">Lưu</button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;
