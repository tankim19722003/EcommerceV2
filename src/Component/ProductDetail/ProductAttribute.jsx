import React from "react";

const productDetails = [
  { label: "Danh Mục", value: "Shopee > Thời Trang Nam > Áo > Áo Sơ Mi", isLink: true },
  { label: "Số lượng hàng khuyến mãi", value: "1002" },
  { label: "Số sản phẩm còn lại", value: "6990" },
  { label: "Thương hiệu", value: "U.Tee", isLink: true },
  { label: "Dáng kiểu áo", value: "Rộng" },
  { label: "Cỡ áo", value: "Cỡ sơ mi" },
  { label: "Kiểu cổ áo", value: "Cổ áo truyền thống" },
  { label: "Phong cách", value: "Cơ bản, Boho, Hàn Quốc, Đường phố, Công sở" },
  { label: "Tall Fit", value: "Có" },
  { label: "Chất liệu", value: "Cotton" },
  { label: "Mẫu", value: "Trơn" },
  
];

const ProductAttribute = ({productAttributes}) => {
   return (
    <div className="bg-white rounded-md p-6 border border-gray-100">
      <h2 className="text-lg font-semibold mb-4">CHI TIẾT SẢN PHẨM</h2>
      <div className="space-y-4 text-sm">
        {productAttributes.map((item, index) => (
          <div key={index} className="flex text-base">
            <span className="text-gray-500 w-48 shrink-0">{item.attribute_name}</span>
            {item.isLink ? (
              <span className="text-blue-600 hover:underline cursor-pointer">
                {item.value}
              </span>
            ) : (
              <span>{item.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductAttribute;
