import { useState } from "react";

const ProductCategoryOneLevel = ({ productCategoryResponses, setMaxProductCategory }) => {

  const [selectedProductCategory, setSelectedProductCategory] = useState(null);

  function handleSelectedProductCategory(category) {
    setSelectedProductCategory(category);
    setMaxProductCategory(category.quantity);
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded my-4">
      {productCategoryResponses.map((category) => (
        <div
          key={category.id}
          style={{ width: "56px" }} // optional: keeps all boxes same width
          onClick={() => {
            handleSelectedProductCategory(category);
          }}

          className={`flex flex-row items-center gap-1 cursor-pointer px-2 py-1 rounded-md shadow-sm text-center min-w-[90px] border ${
                    selectedProductCategory?.id === category.id
                      ? "bg-blue-100 border-blue-500"
                      : "border-gray-200"
                  }`}
        >
          <img
            src={category.image_url}
            alt={category.value}
            className="w-8 h-8 object-cover rounded"
          />
          <span className="text-xs text-gray-700 mt-1 text-center">{category.value}</span>
        </div>
      ))}
    </div>
  );
};

export default ProductCategoryOneLevel;
