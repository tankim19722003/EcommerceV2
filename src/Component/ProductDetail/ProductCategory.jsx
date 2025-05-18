import { useState } from "react";

const ProductCategory = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState(
    data.product_category_two_level[0]
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const productCategoryTwoLevel = data.product_category_two_level;
  console.log(data.sub_product_category_group.product_category_group_name);
  return (
    <div className="container mx-auto p-4 flex flex-col">
      {/* <h2 className="text-2xl font-bold mb-4">Product Categories</h2> */}

      <div className="flex flex-row items-center">
        <span className="mr-4 text-gray-500">{data.product_category_group.product_category_group_name}</span>

        <div className="flex flex-wrap gap-4 mb-6">
          {productCategoryTwoLevel.map((category) => (
            <button
              key={category.product_category_response.id}
              onClick={() => handleCategoryClick(category)}
              className={`flex items-center border p-2 rounded-lg shadow ${
                selectedCategory.product_category_response.id ===
                category.product_category_response.id
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300"
              }`}
            >
              <img
                src={category.product_category_response.image_url}
                alt={category.product_category_response.name}
                className="w-12 h-12 object-cover mr-2"
              />
              <span className="text-lg font-semibold">
                {category.product_category_response.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      {selectedCategory && (
        <div className="flex flex-row items-center">
          {/* <h3 className="text-xl font-semibold mb-2">
            Sizes for {selectedCategory.product_category_response.name}:
          </h3> */}
          <span className="mr-4 text-gray-500">
            {data.sub_product_category_group.product_category_group_name}
          </span>

          <div className="flex flex-wrap gap-2">
            {selectedCategory.child_product_category_responses.map(
              (subCategory) => (
                <div
                  key={subCategory.id}
                  className="border p-2 rounded-lg shadow-sm text-center min-w-[120px]"
                >
                  <p className="font-medium">{subCategory.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {subCategory.quantity}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
