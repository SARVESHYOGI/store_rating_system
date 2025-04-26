import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { ratingApi } from "../utils/api";
import StarRating from "./StarRating";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  storeName: string;
  currentRating?: number | null;
  onRatingSubmit: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  storeId,
  storeName,
  currentRating = null,
  onRatingSubmit,
}) => {
  const [rating, setRating] = useState<number>(currentRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setIsSubmitting(true);

      await ratingApi.submitRating({
        storeId,
        rating,
      });

      toast.success(
        currentRating
          ? "Rating updated successfully"
          : "Rating submitted successfully"
      );
      onRatingSubmit();
      onClose();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0  overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                {currentRating ? "Update your rating" : "Rate this store"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-4">
                {currentRating
                  ? `You've previously rated ${storeName}. You can update your rating below.`
                  : `How would you rate your experience with ${storeName}?`}
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-6 flex flex-col items-center">
                  <div className="mb-3">
                    <StarRating
                      value={rating}
                      onChange={setRating}
                      size="lg"
                      activeColor="text-yellow-500 fill-yellow-500"
                      inactiveColor="text-gray-300"
                      hoverColor="text-yellow-400 fill-yellow-400"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-black hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Rating"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
