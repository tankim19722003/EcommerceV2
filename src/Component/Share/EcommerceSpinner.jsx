const EcommerceSpinner = ({ text = "Đang xử lý đơn hàng..." }) => {
  return (
    <div
      className="fixed inset-0 bg-black/10 flex items-center justify-center z-[9999] pointer-events-auto"
      role="status"
      aria-label={text}
    >
      <div
        className="bg-white shadow-xl rounded-xl px-6 py-5 flex flex-col items-center"
        role="status"
        aria-label={text}
      >
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-teal-500 rounded-full animate-spin"></div>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
            🛒
          </span>
        </div>
        <p className="mt-3 text-gray-800 text-base font-medium animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );
};

export default EcommerceSpinner;
