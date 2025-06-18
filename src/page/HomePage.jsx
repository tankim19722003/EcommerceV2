import Banner from "../Component/Share/Banner";
import Category from "../Component/Category/Category";
import ProductList from "../Component/ProductList/ProductList";
import FlashSale from "../Component/FlashSale/FlashSale";

function HomePage() {
  return (
    <div className="max-w-7xl mx-auto min-h-full">
      <Banner />
      <Category />
      <FlashSale />
      <div className="container mx-auto p-4 min-h-[400px]">
        <h2 className="text-xl font-bold mb-4 py-2 px-4 rounded-t-lg border-b-2 border-red-500 text-center">
          GỢI Ý HÔM NAY
        </h2>
        <ProductList />
      </div>
    </div>
  );
}

export default HomePage;
