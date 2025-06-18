
const Shop = ({ shopInfo }) => {
  const isActive = shopInfo.is_active;
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 shadow-md  space-y-4 md:space-y-0 md:space-x-6 border border-gray-100 my-4">
      {/* Shop Info */}
      <div className="flex items-center space-x-4">
        <img
          src="https://via.placeholder.com/64x64.png?text=U.TEE" // replace with actual logo path
          alt="Shop Logo"
          className="w-16 h-16 rounded-full bg-black object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{shopInfo.shop_name}</h2>
          {isActive && (
            <p className="text-sm text-gray-500 mb-2 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Đang online
            </p>
          )}

          {!isActive && (
            <p className="text-sm text-gray-400 mb-2 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Không hoạt động
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">
              ❤️ Yêu Thích+
            </button>
            <button className="px-3 py-1 text-sm text-white bg-orange-500 rounded hover:bg-orange-600">
              💬 Chat Ngay
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              🛒 Xem Shop
            </button>
          </div>
        </div>
      </div>

      {/* Shop Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-sm text-gray-700 w-full md:w-auto">
        {/* <div className="d-flex flex-col flex-wrap md:w-auto"> */}
        {/* <div>
          <p>Đánh Giá</p>
          <p className="text-red-500 font-semibold">17,1k</p>
        </div>
        <div>
          <p>Sản Phẩm</p>
          <p className="text-red-500 font-semibold">97</p>
        </div> */}
        <div>
          <p>Tham Gia</p>
          <p className="text-red-500 font-semibold">
            {new Date(shopInfo.created_at).toLocaleDateString("en-GB")}
          </p>
        </div>
        <div>
          <p>Sản Phẩm</p>
          <p className="text-red-500 font-semibold text-center">
            {shopInfo.total_products}
          </p>
        </div>
        {/* <div>
          <p>Đánh Giá</p>
          <p className="text-red-500 font-semibold">17,1k</p>
        </div> */}

        {/* <div>
          <p>Người Theo Dõi</p>
          <p className="text-red-500 font-semibold">62,2k</p>
        </div> */}
      </div>
    </div>
  );
};

export default Shop;
