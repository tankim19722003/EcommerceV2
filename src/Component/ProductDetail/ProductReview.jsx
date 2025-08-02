import { useParams } from "react-router-dom";
import ReviewItem from "./ReviewItem";
import { useEffect, useState } from "react";
import { api } from "../../config/interceptor-config";

const ReviewCard = ({ review }) => (
  <div className="border-t pt-4 mt-4">
    <div className="flex items-center gap-3">
      <img
        src={`https://ui-avatars.com/api/?name=${review.username}&background=random`}
        alt="avatar"
        className="w-10 h-10 rounded-full"
      />
      <div>
        <p className="font-semibold">{review.username}</p>
        <p className="text-sm text-gray-500">
          {review.date} | {review.variant}
        </p>
      </div>
    </div>
    <div className="text-yellow-500 mt-2">
      {"★".repeat(review.rating)}
      {"☆".repeat(5 - review.rating)}
    </div>
    <p className="mt-2">{review.comment}</p>
    <div className="flex gap-2 flex-wrap mt-2">
      {review.images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`review-${idx}`}
          className="w-20 h-20 rounded object-cover"
        />
      ))}
    </div>
  </div>
);

const ProductReview = ({ ratingSummary, productRating }) => {
  const { id } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        setLoading(true);
        const response = await api.get(
          `http://localhost:8080/api/v1/feedback/get_all_feed_back/${id}`
        );
        setLoading(false);
        setFeedbacks(response.data);
      } catch (error) {
        console.log("error: " + error);
      }
    }

    fetchFeedback();
  }, [id]);

  // Prepare rating counts, default to 0 if ratingSummary is null
  const ratingCounts = ratingSummary || {
    rating1: 0,
    rating2: 0,
    rating3: 0,
    rating4: 0,
    rating5: 0,
  };

  // Format numbers for display (e.g., 4600 -> 4,6k)
  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`.replace(".0k", "k");
    }
    return num.toString();
  };

  // Create filter buttons array
  const filterButtons = [
    `5 Sao (${formatNumber(ratingCounts.rating5)})`,
    `4 Sao (${formatNumber(ratingCounts.rating4)})`,
    `3 Sao (${formatNumber(ratingCounts.rating3)})`,
    `2 Sao (${formatNumber(ratingCounts.rating2)})`,
    `1 Sao (${formatNumber(ratingCounts.rating1)})`,
  ];

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white my-4">
      <h2 className="text-2xl font-bold mb-4">ĐÁNH GIÁ SẢN PHẨM</h2>

      <div className="flex flex-row items-center gap-2.5 bg-amber-50 p-7">
        {/* Summary */}
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold text-red-500">
            {productRating}
          </span>
          <div>
            <div className="flex text-lg">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={
                    i <= productRating ? "text-yellow-500" : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600">trên 5</p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((label, idx) => (
            <button
              key={idx}
              className="border-1 border-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-100 bg-white cursor-pointer"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {feedbacks.map((review, index) => (
        <ReviewItem key={index} review={review} />
      ))}
    </div>
  );
};

export default ProductReview;
