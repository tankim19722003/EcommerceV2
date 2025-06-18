import { useParams } from "react-router-dom";
import ReviewItem from "./ReviewItem";
import { use, useEffect, useState } from "react";

const reviews = [
  {
    username: "giangk19b12345",
    date: "2023-11-19 08:54",
    variant: "Trắng, L",
    rating: 5,
    comment: "Chời ơi rất recommend mn mua áo luôn nha...",
    images: [
      "https://via.placeholder.com/80",
      "https://via.placeholder.com/80",
      "https://via.placeholder.com/80",
      "https://via.placeholder.com/80",
      "https://via.placeholder.com/80",
    ],
  },
  {
    username: "08hoai_thuong",
    date: "2023-11-27 17:07",
    variant: "Trắng, M",
    rating: 5,
    comment: "Áo rất đẹp rất hài lòng với sản phẩm...",
    images: [
      "https://via.placeholder.com/80",
      "https://via.placeholder.com/80",
      "https://via.placeholder.com/80",
    ],
  },
];

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

const ProductReview = () => {
  const { id } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeedback() {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/v1/feedback/get_all_feed_back/${id}`
      );
      setLoading(false);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setFeedbacks(data);

    }

    fetchFeedback();
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  if (feedbacks.length === 0) {
    return <div className="text-center">No reviews available.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white my-4 ">
      <h2 className="text-2xl font-bold mb-4">ĐÁNH GIÁ SẢN PHẨM</h2>

      <div className="flex flex-row items-center gap-2.5 bg-amber-50  p-7">
        {/* Summary */}
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold text-red-500">4.9</span>
          <div>
            <div className="text-yellow-500 text-lg">★★★★★</div>
            <p className="text-sm text-gray-600">trên 5</p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            "Tất Cả",
            "5 Sao (4,6k)",
            "4 Sao (216)",
            "3 Sao (42)",
            "2 Sao (12)",
            "1 Sao (20)",
          ].map((label, idx) => (
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
