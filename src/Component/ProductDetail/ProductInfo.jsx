const ProductInfo = ({ name, rating, reviews, price }) => {
  const filledStars = Math.floor(rating);
  const emptyStars = 5 - filledStars;

  return (
    <div className="mt-4">
      <h1 className="text-xl font-bold">{name}</h1>
      <div className="flex items-center mt-2">
        <span className="text-yellow-500">
          {'★'.repeat(filledStars)}
        </span>
        <span className="text-gray-300">
          {'★'.repeat(emptyStars)}
        </span>
        <span className="ml-2 text-gray-600">
          {rating.toFixed(1)} ({reviews} Đánh Giá)
        </span>
      </div>
      <p className="text-2xl text-red-500 font-bold mt-2">
        {price.toLocaleString()}đ
      </p>
    </div>
  );
};

export default ProductInfo;
