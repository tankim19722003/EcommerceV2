import { useParams } from "react-router-dom";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import { useEffect, useState } from "react";
import ProductCard from "../Component/ProductDetail/ProductCard";

function ProductDetailPage() {

    const [product, setProduct] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState("");

    const { id } = useParams();
    useEffect(() => {
        async function fetchData() {
            setIsFetching(true);
            try {
                const response = await fetch(`http://localhost:8080/api/v1/product/get_product_detail/${id}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError({ message: error.message || 'Failed to fetch data.' });
            }
            setIsFetching(false);
        }
        fetchData();
    }, []);

    
    if (isFetching && !product) {
        return <div className="text-center">Loading...</div>;
    }
    
    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }  
    

  return (
    <>
      <Header />
      <div className='max-w-7xl mx-auto'>
       {product && <ProductCard product={product} />}
      </div>
      <Footer/>
    </>
  );
}

export default ProductDetailPage;