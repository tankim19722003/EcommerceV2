import { Link, useLocation } from "react-router-dom"; // Add useLocation
import Pagination from "../ProductDetail/Pagination";
import { useEffect, useState } from "react";
import { getProductsByPage } from "../../Http/ProductHttp";
import { ClipLoader } from "react-spinners";
import axios from "axios"; // Import axios for API calls
import { api } from "../../config/interceptor-config";

let firstTimeVisiting = true;

const ProductList = () => {
  const [products, setProducts] = useState(null);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const itemsPerPage = 10; // Number of items per page
  const location = useLocation(); // Get location for accessing navigation state
  const keyword = location.state?.keyword || ""; // Get keyword from navigation state

  // Fetch products based on keyword or default
  useEffect(() => {
    async function fetchProducts() {
      setIsFetching(true);
      try {
        let productData;
        if (keyword) {
          // Fetch products by keyword
          const response = await api.get(
            `http://localhost:8080/api/v1/product/get_all_product_by_key_word?keyword=${encodeURIComponent(
              keyword
            )}&page=${page}&limit=${itemsPerPage}`
          );
          productData = response.data;
        } else {
          // Fetch default products
          productData = await getProductsByPage(page, itemsPerPage);
        }
        setProducts(productData);
        setIsFetching(false);
        firstTimeVisiting = false;
      } catch (error) {
        firstTimeVisiting = false;
        setIsFetching(false);
        console.error("Failed to fetch products:", error);
      }
    }

    fetchProducts();
  }, [page, keyword]); // Add keyword to dependency array

  if (isFetching || firstTimeVisiting) {
    return <ClipLoader color="#36d7b7" size={50} />;
  }

  if (!isFetching && !products) {
    return (
      <div className="text-center text-gray-500">
        Không có sản phẩm nào được tìm thấy.
      </div>
    );
  }

  return (
    <>
      <div className="my-2">
        {keyword && (
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Kết quả tìm kiếm cho từ khóa:{" "}
            <span className="text-teal-600">"{keyword}"</span>
          </h2>
        )}
        <div className="flex flex-wrap gap-4">
          {products.product_list_responses.map((product, index) => (
            <Link
              to={`/product/${product.id}`}
              key={index}
              className="flex-none w-48 p-2 border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition"
            >
              <img
                src={product.thumbnail?.avatar_url}
                alt={product.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-2">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {product.name}
                </p>
                <p className="text-lg font-semibold text-red-600">
                  đ{product.price.toLocaleString()}
                </p>
                {product.discount && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    {product.discount}
                  </span>
                )}
                {product.voucher && (
                  <span className="text-xs bg-yellow-400 text-white px-2 py-1 rounded ml-2">
                    Voucher
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <Pagination
          totalPage={products.total_page}
          onPageChange={setPage}
          page={page}
        />
      </div>
    </>
  );
};

export default ProductList;
