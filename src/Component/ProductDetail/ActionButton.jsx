// Action Buttons Component
const ActionButtons = () => {
  return (
    <div className="mt-4 flex space-x-4">
      <button className="flex-1 bg-orange-100 text-orange-500 font-bold py-3 rounded-lg hover:bg-orange-200 hover:text-orange-600 transition duration-300">
        Thêm Vào Giỏ Hàng
      </button>
      <button className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition duration-300">
        Mua Ngay
      </button>
    </div>
  );
};

export default ActionButtons;