import { Link } from "react-router-dom";
import Pagination from "../ProductDetail/Pagination";
import { useEffect, useState } from "react";
import { getProductsByPage } from "../../Http/ProductHttp";
import { ClipLoader } from "react-spinners";

let firstTimeVisting = true;
const ProductList = () => {
  const [products, setProducts] = useState(null);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const itemsPerPage = 2; // Number of items per page
  // get product card
  useEffect(() => {
    // Fetch product data if needed
    async function fetchProducts() {
      setIsFetching(true);
      const productData = await getProductsByPage(page, itemsPerPage);
      setProducts(productData);
      setIsFetching(false);
      firstTimeVisting = false;
    }

    fetchProducts();
  }, [page]);

  if (isFetching || firstTimeVisting) {
    return (
        <ClipLoader color="#36d7b7" size={50} />
    );
  }

  if (!isFetching && !products) {
    return (
      <div className="text-center text-gray-500">
        No products available at the moment.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {products.productRatingOrderResponses.map((product, index) => (
          <Link
            to={`/product/${product.id}`}
            key={index}
            className="flex-none w-48 p-2 border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition"
          >
            <img
              src={product.thumbnail.avatar_url}
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
  );
};

export default ProductList;
