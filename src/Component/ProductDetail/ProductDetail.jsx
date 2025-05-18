// Product Details Component
const ProductDetail = ({ name, rating, reviews, price }) => {
  
  return (
    <div className="mt-4">
      <h1 className="text-xl font-bold">{name}</h1>
      <div className="flex items-center mt-2">
        <span className="text-yellow-500">{'★'.repeat(Math.floor(rating))}</span>
        <span className="ml-2 text-gray-600">{rating.toFixed(1)} ({reviews} Đánh Giá)</span>
        <span className="ml-2 text-green-600">Tố Cao</span>
      </div>
      <p className="text-2xl text-red-500 font-bold mt-2">{price.toLocaleString()}đ</p>
    </div>
  );
};
export default ProductDetail;
