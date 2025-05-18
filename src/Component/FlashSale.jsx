// src/components/FlashSale.js
import { useEffect, useState } from 'react';

const FlashSale = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getFlashSaleProducts() {
      try {
        setIsFetching(true);
        const response = await fetch('http://localhost:8080/api/v1/product/get_product_flash_sale?page=0&limit=10');
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching flash sale products:', error);
      }finally {
        setIsFetching(false);
      }
    }

    getFlashSaleProducts();
  }, []);


  // const products = [
  //   { id: 1, name: 'Bàn phím cơ Akko F75', price: 'đ 760.000', discount: 'Mall', voucher: '15.5%', status: 'ĐANG BÁN CHẠY', image: 'https://shop.photozone.com.vn/wp-content/uploads/2017/04/6-bi-quyet-de-chup-anh-san-pham-dep-bang-dien-thoai_photoZone-com-vn-12.jpg' },
  //   { id: 2, name: 'Son bóng dưỡng môi', price: 'đ 163.900', discount: 'Mall', voucher: '15.5%', status: 'ĐANG BÁN CHẠY', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-card-40-iphone16prohero-202409_FMT_WHH?wid=508&hei=472&fmt=p-jpg&qlt=95&.v=MjUrdW9rK0I3Y0hBcFdUR2pNVTRtUFpIU2c1QXYxN1o5THJsVFdubi8vdU9STS9wYXZTN1hicnBjZ2p3Y1lQVndnZDdrU0tSek5hTHNwZzJKOWwvbnRrb3YwRE90eklmVkIwdHovcEFheWlka3BhTzl6cklqNm1lL21taEZoT3c' },
  //   { id: 3, name: 'Serum dưỡng thể', price: 'đ 3.819.000', discount: 'Mall', voucher: '15.5%', status: 'CHỈ CÒN 7', image: 'https://static.rangdongstore.vn/2204005473/2022/04/11/den-ban-led-bao-ve-thi-luc-rd-rl-26-5w-3000k-1-i1r.jpeg?fm=webp&w=500' },
  //   { id: 4, name: 'Quần short nam', price: 'đ 278.650', discount: 'Mall', voucher: '15.5%', status: 'ĐANG BÁN CHẠY', image: 'https://nijiavietnam.vn/wp-content/uploads/2023/03/Winter-bull.png' },
  //   { id: 5, name: 'Snack gạo lứt', price: 'đ 179.000', discount: 'Mall', voucher: '15.5%', status: 'ĐANG BÁN CHẠY', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2d3jraRRiNsI4FdDNWyPgEBGxqhPPBLwwHg&s' },
  //   { id: 6, name: 'Quần thể thao nam', price: 'đ 302.150', discount: 'Mall', voucher: '15.5%', status: 'ĐANG BÁN CHẠY', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7CmvIzBBdodiy3PxzCWGAZcHXWi6Y4gVLSA&s' },
  // ];

  if (isFetching) {
    return <p className="text-center text-red-500">Loading...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }
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
            <p className={`text-xs mt-1 bg-orange-100 text-orange-500 px-2 py-1 rounded`}>
              Đang bán chạy
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlashSale;