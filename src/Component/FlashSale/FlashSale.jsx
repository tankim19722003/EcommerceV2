import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EcommerceSpinner from "../Share/EcommerceSpinner";
import ProductListView from "../ProductList/ProductListView";

const FlashSale = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getFlashSaleProducts() {
      setIsFetching(true);
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/product/get_product_flash_sale?page=0&limit=10"
        );
        const data = await response.json();
        console.log("Flash Sale Products:", data); // Debug: Log fetched products

        if (response.ok) {
          setProducts(data.product_list_responses || []);
        } else {
          setError(data.message || "Failed to fetch flash sale products.");
        }
      } catch (error) {
        setError("Network error. Please try again later.");
      } finally {
        setIsFetching(false);
      }
    }

    getFlashSaleProducts();
  }, []);

  if (isFetching) {
    return <EcommerceSpinner text="Đang tải sản phẩm flash sale..." />;
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">⚡ FLASH SALE</h2>
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={() => {
              setError("");
              getFlashSaleProducts();
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white p-4 sm:p-6 rounded-t-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-red-500">
            ⚡ FLASH SALE
          </h2>
          <Link
            to="/flash-sale"
            className="text-red-500 font-semibold text-sm sm:text-base hover:underline mt-2 sm:mt-0"
          >
            Xem tất cả →
          </Link>
        </div>
        <ProductListView products={products} />
      </div>
    </section>
  );
};

export default FlashSale;