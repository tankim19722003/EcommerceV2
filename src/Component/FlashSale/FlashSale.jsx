import { useEffect, useState } from "react";

const FlashSale = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getFlashSaleProducts() {
      setIsFetching(true);
      const response = await fetch(
        "http://localhost:8080/api/v1/product/get_product_flash_sale?page=0&limit=10"
      );
      setIsFetching(false);

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    }

    getFlashSaleProducts();
  }, []);

  if (isFetching && !error) {
    return <p className="text-center text-red-500">Loading...</p>;
  }
  if (error) {
    return ;
  }
  console.log(error);

  return (
    <section className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-t-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-500">⚡ FLASH SALE</h2>
        <a href="#" className="text-red-500 font-bold text-lg hover:underline">
          Xem tất cả →
        </a>
      </div>
      <div className="grid grid-cols-6 gap-4 bg-white p-4 rounded-b-lg shadow-md">
        {products.map((product) => (
          <div
            key={product.product_id}
            className="relative p-2 bg-white rounded-lg hover:scale-105 transition-transform duration-200"
          >
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Shop
            </div>
            <img
              src={product.product_image}
              alt={product.product_name}
              className="w-full h-36 object-contain rounded"
            />
            <div className="absolute top-2 right-2 bg-yellow-400 text-gray-800 text-xs px-2 py-1 rounded">
              {product.discount_percent}%
            </div>
            <h3 className="text-sm font-medium text-gray-800 mt-2">
              {product.product_name}
            </h3>
            <p className="text-red-500 font-bold mt-1">{product.price}</p>
            <p
              className={`text-xs mt-1 bg-orange-100 text-orange-500 px-2 py-1 rounded`}
            >
              Đang bán chạy
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlashSale;
