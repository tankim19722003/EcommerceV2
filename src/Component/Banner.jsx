import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import banner1 from '../assets/banner/banner1.jpg';
import banner2 from '../assets/banner/banner2.jpg';
import banner3 from '../assets/banner/banner3.jpg';
import slider1 from '../assets/banner/slider1.jpg';
import slider2 from '../assets/banner/slider2.jpg';

const Banner = () => {
  return (
    <div className="w-full flex justify-between mt-4 items-center gap-4">
      {/* Main Banner Carousel */}
      <div className="w-3/4">
        <Carousel showThumbs={false} autoPlay infiniteLoop>
          <div>
            <img src={banner1} alt="Banner 1" className="rounded-lg w-full h-64 object-fit" />
          </div>
          <div>
            <img src={banner2} alt="Banner 2" className="rounded-lg w-full h-64 object-fit" />
          </div>
          <div>
            <img
              src={banner3}
              alt="Banner 3"
              className="rounded-lg w-full h-[256px] object-cover"
            />
          </div>
        </Carousel>
      </div>

      {/* Side Banners */}
      <div className="w-1/4 flex flex-col gap-1 ">
        <div className="w-full">
          <img src={slider1} alt="Side Banner 1" className="rounded-lg w-full h-32 object-cover" />
        </div>
        <div className="w-full">
          <img src={slider2} alt="Side Banner 2" className="rounded-lg w-full h-32 object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Banner;
