import { Link } from "react-router-dom";

function ProductListView({ products }) {
  console.log("ProductListView products:", products); // Debug: Log products

  // Function to render star ratings
  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <svg
          key={`filled-${i}`}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118l-3.39-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      );
    }

    for (let i = filledStars; i < totalStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118l-3.39-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="flex flex-wrap -mx-2 p-4">
      {products.map((product, index) => (
        <Link
          key={index}
          to={`/product/${product.id}`}
          className="w-full sm:w-1/2 lg:w-1/6 px-2 mb-4 cursor-pointer"
        >
          <div className="block h-full border border-gray-200 rounded-xl bg-white shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1">
            {/* Product Thumbnail */}
            <div className="relative w-full h-40">
              <img
                src={
                  product.thumbnail?.avatar_url ||
                  "https://via.placeholder.com/150?text=No+Image"
                }
                alt={product.name}
                className="w-full h-full object-cover rounded-t-xl"
              />
              {/* Voucher Badge */}

              {product.product_discount_response && (
                <span className="absolute top-1 right-1 text-xs bg-red-500 text-white px-2 py-1 rounded shadow-md">
                  -
                  {product.product_discount_response.discountPercent}
                  %
                </span>
              )}
            </div>

            <div className="p-3">
              {/* Product Name */}
              <p className="text-sm font-medium text-gray-800 line-clamp-2">
                {product.name}
              </p>

              {/* Description */}
              <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                {product.description}
              </p>

              {/* Price */}
              {product.product_discount_response ? (
                <div className="mt-1">
                  {/* Original price with strikethrough */}
                  <p className="text-sm line-through text-gray-500">
                    đ{product.price.toLocaleString()}
                  </p>
                  {/* Discounted price */}
                  <p className="text-base font-semibold text-red-600">
                    đ
                    {(
                      product.price *
                      (1 -
                        product.product_discount_response.discountPercent / 100)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              ) : (
                <p className="text-base font-semibold text-red-600 mt-1">
                  {product.price === 0
                    ? "Free"
                    : `đ${product.price.toLocaleString()}`}
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center mt-1">
                {renderStars(product.rating)}
              </div>

              {/* Total Sold */}
              <p className="text-xs text-gray-500 mt-1">
                Đã bán {product.total_sold}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProductListView;
