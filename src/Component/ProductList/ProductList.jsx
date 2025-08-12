import { Link, useLocation, useParams } from "react-router-dom";
import Pagination from "../ProductDetail/Pagination";
import { useEffect, useState } from "react";
import { getProductsByPage } from "../../Http/ProductHttp";
import { ClipLoader } from "react-spinners";
import { api } from "../../config/interceptor-config";
import ProductListView from "./ProductListView";

let firstTimeVisiting = true;

const ProductList = ({ productItems, totalPage }) => {
  const [displayProducts, setDisplayProducts] = useState(productItems || null);
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("default");
  const [isFetching, setIsFetching] = useState(false);
  const itemsPerPage = 48;
  const location = useLocation();
  const keyword = location.state?.keyword || "";
  const { id: categoryId } = useParams();

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setIsFetching(true);
      try {
        let productData = displayProducts || [];
        if (categoryId) {
          const response = await api.get(
            `http://localhost:8080/api/v1/product/get_product_by_category/${categoryId}?page=${page}&limit=${itemsPerPage}`
          );
          productData = response.data.product_list_responses;
        } else if (keyword) {
          const response = await api.get(
            `http://localhost:8080/api/v1/product/get_all_product_by_key_word?keyword=${encodeURIComponent(
              keyword
            )}&page=${page}&limit=${itemsPerPage}`
          );
          productData = response.data.product_list_responses;
        } else {
          let productDataResponse;
          if (!displayProducts) {
            productDataResponse = await getProductsByPage(page, itemsPerPage);
            productData = productDataResponse.product_list_responses;
            console.log("Initial fetch, setting displayProducts:", productData);
          } 
        }

        setDisplayProducts(productData);
        setIsFetching(false);
        firstTimeVisiting = false;
      } catch (error) {
        firstTimeVisiting = false;
        setIsFetching(false);
        console.error("Failed to fetch products:", error);
      }
    }

    fetchProducts();
  }, [page, keyword]);

  // Handle sort change
  const handleSortChange = (event) => {
    const newSortOrder = event.target.value;
    setDisplayProducts(() =>
      sortProductsByPrice(displayProducts, newSortOrder)
    );
    setPage(0); // Reset to first page
  };

  function sortProductsByPrice(products, sortType) {
    if (!Array.isArray(products)) return [];

    const sorted = [...products].sort((a, b) => {
      if (sortType === "increment") {
        return a.price - b.price;
      } else if (sortType === "decrement") {
        return b.price - a.price;
      }
      return 0; // default: no sorting
    });

    return sorted;
  }

  if (isFetching || firstTimeVisiting) {
    return <ClipLoader color="#36d7b7" size={50} />;
  }

  if (!isFetching && !displayProducts) {
    return (
      <div className="text-center text-gray-500">
        Không có sản phẩm nào được tìm thấy.
      </div>
    );
  }

  return (
    <div className="my-2 py-8">
      {(keyword || categoryId) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 px-4 sm:px-6 lg:px-8">
          <div className="mt-3 sm:mt-0 sm:ml-auto">
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="block w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
              aria-label="Sắp xếp sản phẩm theo giá"
            >
              <option value="default">Sắp xếp: Giá</option>
              <option value="increment">Giá: Thấp đến Cao</option>
              <option value="decrement">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>
      )}

      <ProductListView products={displayProducts} />
      <Pagination
        totalPage={displayProducts.total_page}
        onPageChange={setPage}
        page={page}
      />
    </div>
  );
};

export default ProductList;
