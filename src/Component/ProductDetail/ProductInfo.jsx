const ProductInfo = ({ name, rating, reviews, price, discount }) => {
  const filledStars = Math.floor(rating);
  const emptyStars = 5 - filledStars;

  const discountedPrice = discount
    ? Math.floor(price * (1 - discount / 100))
    : price;

  return (
    <div className="mt-4">
      <h1 className="text-xl font-bold">{name}</h1>

      <div className="flex items-center mt-2">
        <span className="text-yellow-500">{"★".repeat(filledStars)}</span>
        <span className="text-gray-300">{"★".repeat(emptyStars)}</span>
        <span className="ml-2 text-gray-600">
          {rating.toFixed(1)} ({reviews} Đánh Giá)
        </span>
      </div>

      <div className="mt-2 flex items-center">
        <p className="text-2xl text-red-500 font-bold">
          {discountedPrice.toLocaleString()}đ
        </p>
        {discount > 0 && (
          <p className="text-sm line-through text-gray-500  mx-3g">
            {price.toLocaleString()}đ
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
