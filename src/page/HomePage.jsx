import Header from '../Component/Header';
import Banner from '../Component/Banner';
import Category from '../Component/Category';
import ProductList from '../Component/ProductList';
import Footer from '../Component/Footer';
import FlashSale from '../Component/FlashSale';

function HomePage() {
  return (
    <>
      <Header />
      <div className='max-w-7xl mx-auto'>
        <Banner />
        <Category />
        <FlashSale />
        <ProductList/>
      </div>
      <Footer />
    </>
     
  );
}
export default HomePage;

