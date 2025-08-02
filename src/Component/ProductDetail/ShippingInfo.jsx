import { useState } from "react";

const ShippingInfo = ({ productShippingTypes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("ShippingInfo component rendered with productShippingTypes:", productShippingTypes);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mt-4">
      <p className="text-gray-700">
        Vận Chuyển: {" "}
        <span
          className="text-green-600 cursor-pointer"
          onClick={handleOpenModal}
        >
          Nhấn để xem các phương thức vận chuyển &gt;
        </span>
      </p>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
           style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="bg-white p-4 rounded-lg w-xl">
            <h2 className="text-lg font-semibold mb-2">
              Thông tin về phí vận chuyển
            </h2>

            {productShippingTypes.length > 0 ? (
              <div className="border-t border-gray-300 mt-2 pt-2">
                {productShippingTypes.map((shipping) => (
                  <div key={shipping.id} className="mb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{shipping.shippingType.name}</h3>
                      <p className="text-gray-500">
                        {shipping.shippingType.price.toLocaleString()}đ
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {shipping.shippingType.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Không có thông tin vận chuyển.</p>
            )}

            <div className="mt-4 flex w-full justify-end">
              <button
                className="bg-red-500 text-white py-1 px-4 rounded-lg cursor-pointer"
                onClick={handleCloseModal}
              >
                Đã Hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingInfo;
