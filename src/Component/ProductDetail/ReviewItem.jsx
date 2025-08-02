const ReviewItem = ({ review }) => {
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
      <div className="table w-full">
        <div className="table-row">
          <div className="table-cell align-middle">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-semibold">
              <img
                src={review.user_avatar_url}
                className="w-full h-full object-cover rounded-full"
                alt="User avatar"
              />
            </div>
          </div>

          {/* col for user info */}
          <div className="table-cell p-2">
            <div>
              <div className="text-sm font-medium">{review.user_account}</div>
              <div className="text-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${
                      star <= review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {formatDateTime(review.created_at)} | Phân loại hàng:{" "}
              {review.product_category_value +
                (review.sub_product_category_value
                  ? ", " + review.sub_product_category_value
                  : "")}
            </p>
          </div>
        </div>

        <div className="table-row">
          <div className="table-cell p-2"></div>
          <span className="table-cell text-sm text-gray-800 p-2">
            {review.content}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;