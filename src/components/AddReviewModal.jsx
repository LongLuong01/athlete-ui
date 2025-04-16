import React, { useState } from "react";
import API_BASE_URL from "../../config";
import { REVIEW_MAPPINGS } from "../constants/reviewMappings";
import Toast from "./Toast";
import { useToast } from "../hooks/useToast";
import { wellbeingApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "./ConfirmDialog";

const AddReviewModal = ({ isOpen, onClose, onSuccess = () => {} }) => {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    training_date: today,
    fatigue_level: "3",
    sleeping_quality: "3",
    muscle_soreness: "3",
    stress_level: "3",
    mental_state: "3",
    muscle_soreness_point: "",
    sleep_hours: "8",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const validateForm = () => {
    const requiredFields = [
      "fatigue_level",
      "sleeping_quality",
      "muscle_soreness",
      "stress_level",
      "mental_state",
      "sleep_hours",
      "training_date"
    ];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      showToast("Vui lòng điền đầy đủ thông tin đánh giá", "error");
      return false;
    }

    const sleepHours = Number(formData.sleep_hours);
    if (sleepHours < 0 || sleepHours > 23) {
      showToast("Số giờ ngủ phải từ 0 đến 23", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      // Convert numeric fields to numbers and handle default value for muscle_soreness_point
      const reviewData = {
        athlete_id: user.id,
        training_date: formData.training_date,
        fatigue_level: Number(formData.fatigue_level),
        sleeping_quality: Number(formData.sleeping_quality),
        muscle_soreness: Number(formData.muscle_soreness),
        stress_level: Number(formData.stress_level),
        mental_state: Number(formData.mental_state),
        muscle_soreness_point: formData.muscle_soreness_point.trim() || "Không có",
        sleep_hours: Number(formData.sleep_hours),
        notes: formData.notes || ""
      };

      await wellbeingApi.createReview(reviewData, token);
      
      setIsDirty(false);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(true);
  };

  const handleClose = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    setIsDirty(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto h-max-">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] my-4 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Thêm đánh giá mới</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Training Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày tập luyện
                </label>
                <input
                  type="date"
                  name="training_date"
                  value={formData.training_date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              {/* Muscle Soreness Point */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm đau nhức cơ bắp
                </label>
                <input
                  type="text"
                  name="muscle_soreness_point"
                  value={formData.muscle_soreness_point}
                  onChange={handleChange}
                  placeholder="Để trống nếu không có"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Sleep Hours */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số giờ ngủ trung bình (0-23)
                </label>
                <input
                  type="number"
                  name="sleep_hours"
                  value={formData.sleep_hours}
                  onChange={handleChange}
                  min="0"
                  max="23"
                  step="1"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              {/* Rating Fields */}
              {Object.entries(REVIEW_MAPPINGS).map(([key, options]) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key === 'fatigue_level' ? 'Mệt mỏi' :
                     key === 'sleeping_quality' ? 'Chất lượng giấc ngủ' :
                     key === 'muscle_soreness' ? 'Đau nhức cơ bắp' :
                     key === 'stress_level' ? 'Mức độ stress' :
                     'Tinh thần'}
                  </label>
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Chọn đánh giá</option>
                    {Object.entries(options).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-2 border rounded-md"
                  rows="3"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                    isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang gửi...
                    </div>
                  ) : 'Gửi đánh giá'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        message="Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn đóng form không?"
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </>
  );
};

export default AddReviewModal;
