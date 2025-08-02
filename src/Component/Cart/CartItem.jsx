import { TrashIcon } from "lucide-react";
import { useState } from "react";

const CartItem = ({
  item,
  isSelected,
  onQuantityChange,
  onToggleSelect,
  onRemove,
}) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(item, newQuantity);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (onQuantityChange) {
        onQuantityChange(item, newQuantity);
      }
    }
  };

  return (
    <div className="grid grid-cols-7 gap-6 py-4 border-b border-gray-300 items-center hover:bg-gray-50 transition">
      {/* 1 ─ Chọn */}
      <div className="flex justify-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(item, !isSelected)}
          className="w-5 h-5 accent-blue-600"
        />
      </div>

      {/* 2-3 ─ Sản phẩm */}
      <div className="col-span-2 flex items-center">
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-cover mr-6 rounded-md shadow-sm"
        />
        <div>
          <p className="text-base font-medium text-gray-800 line-clamp-2">
            {item.name}
          </p>
          <p className="text-xs text-gray-500 line-clamp-1">{item.type}</p>
        </div>
      </div>

      {/* 4 ─ Đơn giá */}
      <span className="text-center text-base font-medium text-gray-800">
        ₫{item.price.toLocaleString()}
      </span>

      {/* 5 ─ Số lượng */}
      <div className="flex justify-center items-center space-x-3">
        <button
          onClick={handleDecrease}
          className="w-10 h-9 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm font-medium flex items-center justify-center"
        >
          −
        </button>
        <input
          type="text"
          value={quantity}
          onChange={(e) => {
            const newValue = Math.max(1, parseInt(e.target.value) || 1);
            setQuantity(newValue);
            if (onQuantityChange) {
              onQuantityChange(item, newValue);
            }
          }}
          className="w-12 h-9 text-center border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
        />
        <button
          onClick={handleIncrease}
          className="w-10 h-9 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm font-medium flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* 6 ─ Số tiền */}
      <span className="text-center text-base font-medium text-gray-800">
        ₫{(item.price * quantity).toLocaleString()}
      </span>

      {/* 7 ─ Thao tác */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => onRemove(item)}
          className="text-red-500 hover:text-red-700 cursor-pointer flex items-center justify-center w-8 h-8"
          title="Xóa sản phẩm"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
