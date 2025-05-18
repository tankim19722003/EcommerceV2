import CategoryItem from './CategoryItem';
import { useEffect, useState } from 'react';
import { fetchData } from '../Http/ProductHttp';

let initialValue =[];
const Category = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const [fetchedData, setFetchedData] = useState(initialValue);

  useEffect(() => {
      async function fetchData() {
        setIsFetching(true);
        try {
          const response = await fetch("http://localhost:8080/api/v1/sub_category");
          const data = await response.json();
          console.log(data);

          // console.log(data);
          setFetchedData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError({ message: error.message || 'Failed to fetch data.' });
        }
  
        setIsFetching(false);
      }
  
      fetchData();
    }, []);


   return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">DANH MỤC</h2>
      <div className="overflow-x-auto">
        <div className="flex flex-nowrap gap-4">
          {fetchedData.map((category, index) => (
            <CategoryItem key={index} name={category.category_response.name} img={category.thumbnail_url} />
          ))}
        </div>
      </div>
    </div>);
};

export default Category;