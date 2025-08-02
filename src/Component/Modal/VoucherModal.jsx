import { useState } from "react";

const VoucherModal = ({ isOpen, onClose, vouchers, onSelectVoucher, total }) => {
  const [selectedVoucherIdx, setSelectedVoucherIdx] = useState(-1);

  const isVoucherValid = (voucher) => {
    const now = new Date();
    const start = new Date(voucher.start_date);
    const end = new Date(voucher.end_date);
    return now >= start && now <= end;
  };

  const handleSelect = (idx) => {
    setSelectedVoucherIdx(idx);
  };

  const handleSave = () => {
    if (selectedVoucherIdx >= 0) {
      onSelectVoucher(selectedVoucherIdx);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl p-6 bg-white rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-red-600 mb-6 border-b-2 border-gray-200 pb-2">Chọn Voucher</h2>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {vouchers.length === 0 ? (
            <p className="text-gray-600">Không có voucher nào khả dụng.</p>
          ) : (
            vouchers.map((voucher, idx) => {
              const isApplicable = total >= voucher.minimum_order_value && isVoucherValid(voucher);
              const discountAmount = isApplicable
                ? (voucher.discount_percent / 100) * total
                : 0;
              return (
                <label
                  key={voucher.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                    ${selectedVoucherIdx === idx ? 'border-gray-500 bg-teal-50' : 'border-gray-200'}
                    ${!isApplicable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 focus-within:bg-gray-100'}`}
                >
                  <input
                    type="radio"
                    name="voucher"
                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    checked={selectedVoucherIdx === idx}
                    onChange={() => isApplicable && handleSelect(idx)}
                    disabled={!isApplicable}
                  />
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-900">
                      {voucher.description || `Mã ${voucher.code}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      Giảm {voucher.discount_percent}% 
                      {voucher.minimum_order_value ? ` - Yêu cầu tối thiểu ₫${voucher.minimum_order_value.toLocaleString()}` : ''} 
                      - HSD: {new Date(voucher.end_date).toLocaleDateString()}
                      {isApplicable ? ` - Tiết kiệm ₫${discountAmount.toLocaleString()}` : ' - Không áp dụng'}
                    </p>
                  </div>
                </label>
              );
            })
          )}
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSave}
            disabled={selectedVoucherIdx < 0}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherModal;