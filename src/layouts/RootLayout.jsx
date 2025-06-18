import Footer from '../Component/Share/Footer';
import { Outlet } from 'react-router-dom';
import Header from '../Component/share/Header';

function RootLayout() {
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto min-h-[400px]">
        <Outlet /> 
      </div>
      <Footer />
    </>
  );
}

export default RootLayout;