import { useState } from "react";

const ProductCategoryTwoLevel = ({ data, setMaxQuantity, setQuantity }) => {
  const [selectedCategory, setSelectedCategory] = useState(
    data.product_category_two_level[0]
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null); // reset subcategory when category changes

    // disable quantity
    setMaxQuantity(null);
    setQuantity(1); // reset quantity to 1

  };

  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
    //  setDisabled(true);

     setMaxQuantity(subCategory.quantity);

     console.log(subCategory.quantity);
  };

  const productCategoryTwoLevel = data.product_category_two_level;

  return (
    <div className="container mx-auto p-4 flex flex-col">
      <div className="flex flex-row items-center mb-6">
        <span className="mr-4 text-gray-500 text-sm">
          {data.product_category_group.product_category_group_name
            .charAt(0)
            .toUpperCase() +
            data.product_category_group.product_category_group_name.slice(1)}
        </span>

        <div className="flex flex-wrap gap-1.5">
          {productCategoryTwoLevel.map((category) => (
            <button
              key={category.product_category_response.id}
              onClick={() => handleCategoryClick(category)}
              className={`flex items-center border px-2 py-1 rounded-md shadow-sm text-sm min-w-[90px] ${
                selectedCategory.product_category_response.id ===
                category.product_category_response.id
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300"
              }`}
            >
              <img
                src={category.product_category_response.image_url}
                alt={category.product_category_response.name}
                className="w-8 h-8 object-cover mr-1"
              />
              <span className="text-sm font-medium">
                {category.product_category_response.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div className="flex flex-row items-center ">
          <span className="mr-4 text-sm text-gray-500">
            {data.sub_product_category_group.product_category_group_name
              .charAt(0)
              .toUpperCase() +
              data.sub_product_category_group.product_category_group_name.slice(
                1
              )}
          </span>

          <div className="flex flex-wrap gap-1.5 ">
            {selectedCategory.child_product_category_responses.map(
              (subCategory) => (
                <button
                  key={subCategory.id}
                  onClick={() => handleSubCategoryClick(subCategory)}
                  className={`px-2 py-1 rounded-md shadow-sm text-center min-w-[90px] border ${
                    selectedSubCategory?.id === subCategory.id
                      ? "bg-blue-100 border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <p className="text-sm font-medium">{subCategory.name}</p>
                  {/* <p className="text-xs text-gray-600">
                    Quantity: {subCategory.quantity}
                  </p> */}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategoryTwoLevel;
