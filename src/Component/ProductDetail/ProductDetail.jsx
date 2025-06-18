import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import { getProductById } from "../../Http/ProductHttp.js";

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const product = await getProductById(id);
        setProduct(product);
      } catch (err) {
        setError(err.message);
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
    <div>
      <div className="max-w-6xl mx-auto  ">
        {product && <ProductCard product={product} />}
      </div>
    </div>
  );
}

export default ProductDetail;
