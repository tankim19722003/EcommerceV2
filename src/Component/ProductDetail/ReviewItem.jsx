import React from "react";

const ReviewItem = ({ review }) => {
  console.log(review);

  function formatDateTime(dateString) {
    const date = new Date(dateString);

    const pad = (num) => num.toString().padStart(2, "0");

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // months are zero-based
    const year = date.getFullYear();

    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  }

  return (
    <div className="p-4 bg-white border-t border-t-gray-200 w-full max-w-6xl my-3.5">
      <div class="table w-full">
        <div class="table-row">
          <div class="table-cell align-middle">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-semibold">
              <img
                src={review.user_avatar_url}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* col for user info */}
          {/* <div class="table-cell border border-gray-300 p-2"></div> */}
          <div className="table-cell p-2">
            <div>
              <div className="text-sm font-medium">{review.user_account}</div>
              <div className="text-yellow-400 text-sm">
                {"★".repeat(review.rating)}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {formatDateTime(review.created_at)} | Phân loại hàng:{" "}
              {review.product_category_value +
                ", " +
                review.sub_product_category_value}
            </p>
          </div>
        </div>

        <div class="table-row">
          <div class="table-cell p-2"></div>
          {/* <div class="table-cell border border-gray-300 p-2"></div> */}
          <span className="table-cell text-sm text-gray-800 p-2">
            {review.content}
          </span>
        </div>
      </div>

      {/* Header
      <div className="gap-3 mb-2 flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-semibold">
          <img
            src={review.user_avatar_url}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <div>
            <div className="text-sm font-medium">{review.user_account}</div>
            <div className="text-yellow-400 text-sm">
              {"★".repeat(review.rating)}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {review.created_at} | Phân loại hàng:{" "}
            {review.product_category_value +
              ", " +
              review.sub_product_category_value}
          </p>
        </div>
      </div>

      <span className="text-sm text-gray-800">{review.content}</span> */}

      {/* Review Text */}
    </div>
  );
};

export default ReviewItem;
