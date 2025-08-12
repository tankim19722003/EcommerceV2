import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../../config/interceptor-config";
import CategoryItem from "../CategoryItem/CategoryItem";
import { useEffect, useState } from "react";

const Category = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const response = await api.get(
          "http://localhost:8080/api/v1/category/get_all_categories"
        );
        setFetchedData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError({ message: error.message || "Failed to fetch data." });
      } finally {
        setIsFetching(false);
      }
    }

    fetchData();
  }, []);
  function handleViewCategoryProduct(categoryId) {
    console.log(`View products for category ID: ${categoryId}`);
    navigate(`/category/${categoryId}/products`);
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">DANH MỤC</h2>
      {isFetching && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}
      <div className="overflow-x-auto">
        <div className="flex flex-nowrap gap-4">
          {fetchedData.map((category) => (
            <CategoryItem
              key={category.id}
              name={category.name}
              img={category.image_url}
              onViewCategoryProduct={() =>
                handleViewCategoryProduct(category.id)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
