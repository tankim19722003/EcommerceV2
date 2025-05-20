import { useState } from "react";
import QuantitySelector from "./QuantitySelecter";
import ActionButtons from "./ActionButton";
import ShippingInfo from "./ShippingInfo";
import ProductImageSlider from "./ProductImageSlider";
import ProductDetail from "./ProductDetail";
import ProductCategoryTwoLevel from "./ProductCategoryTwoLevel";
import ProductCategoryOneLevel from "./ProductCategoryOneLevel";

// Main Product Card Component
const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(null);
  const productData = {
    name: "[CÓ SẴN] P-Bandai - RG 1/144 The Gundam Base Limited Sazabi [Mechanical Core Plating]",
    rating: 5.0,
    reviews: 1,
    price: 8399000,
    images: [1, 2, 3, 4],
    shippingDate: "18 Th05 - 20 Th05",
    shippingCost: 15000,
    returnPolicy: "Trả hàng miễn phí 15 ngày. Bảo hiểm Thiết hại sản phẩm",
  };

  function handleSetMaxQuantity(quantity) {
    setMaxQuantity(quantity);
  }

  // handle price
  let price = 0;
  const productCategoryResponse = product.product_category_responses;
  const productCategoryOneLevel =
    productCategoryResponse?.product_category_one_level_responses;
  let productCategoryTwoLevel;

  if (productCategoryOneLevel) {
    price = productCategoryOneLevel[0].price;
  } else if (productCategoryTwoLevel) {
    price = productCategoryTwoLevel.child_product_category_responses[0].price;
    productCategoryResponse?.product_category_two_level_responses;
  }

  // console.log(product.product_category_responses);
  const isSlider = product.product_images?.length > 0;

  return (
    <div className="rounded overflow-hidden shadow-lg bg-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Image Slider */}
        {isSlider && <ProductImageSlider images={product.product_images} />}
        {!isSlider && <ProductImageSlider images={[1, 2, 3, 4]} />}
        {/* Right: Product Details */}
        <div>
          <ProductDetail
            name={product.product_basic_info.name}
            rating={product.product_basic_info.rating}
            reviews={productData.reviews}
            price={price}
          />
          <ShippingInfo
            productShippingTypes={product.product_shipping_type_responses}
          />
          {productCategoryResponse?.product_category_two_level && (
            <ProductCategoryTwoLevel
              data={productCategoryResponse}
              setMaxQuantity={handleSetMaxQuantity}
              setQuantity={setQuantity}
            />
          )}

          {productCategoryOneLevel && (
            <ProductCategoryOneLevel
              // data={productCategoryOneLevel}
              // setMaxQuantity={handleSetMaxQuantity}
              // setQuantity={setQuantity}
              productCategoryResponses={productCategoryOneLevel}
              setMaxProductCategory={handleSetMaxQuantity}
            />
          )}

          <QuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
            maxQuantity={maxQuantity}
            isDisabled={maxQuantity === null}
          />
          <ActionButtons />
        </div>
      </div>
    </div>
  );
};
// Product Image Slider Component
export default ProductCard;
