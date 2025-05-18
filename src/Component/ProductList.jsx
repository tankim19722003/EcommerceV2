import React from "react";
import Pagination from "./Pagination";
import { useFetch } from "../Hooks/useFetch";
import { fetchData } from "../Http/ProductHttp";
import { Link } from "react-router-dom";

async function fetchProducts(page = 0, limit = 10) {
  const url = `http://localhost:8080/api/v1/product/get_all_with_rating_order?page=${page}&limit=${limit}`;
  return await fetchData(url);
}


const ProductList = () => {
 const {isFetching, fetchedData : products, setFetchedData, error} = useFetch(fetchProducts, []);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 py-2 px-4 rounded-t-lg border-b-2 border-red-500 text-center">
        GỢI Ý HÔM NAY
      </h2>
      <div>
        <div className="flex flex-wrap gap-4">
          {products.map((product, index) => (
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
      </div>

      <Pagination totalItems={50} itemsPerPage={10} />
    </div>
  );
};

export default ProductList;
