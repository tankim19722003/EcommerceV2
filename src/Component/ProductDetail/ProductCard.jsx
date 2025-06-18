import { useEffect, useState } from "react";
import QuantitySelector from "./QuantitySelecter";
import ActionButtons from "./ActionButton";
import ShippingInfo from "./ShippingInfo";
import ProductImageSlider from "./ProductImageSlider";
import ProductCategoryTwoLevel from "./ProductCategoryTwoLevel";
import ProductCategoryOneLevel from "./ProductCategoryOneLevel";
import Shop from "./Shop";
import ProductAttribute from "./ProductAttribute";
import ProductDescription from "./ProductDescription";
import ProductReview from "./ProductReview";
import ProductInfo from "./ProductInfo";
import { fetchData } from "../../Http/ProductHttp";

// Main Product Card Component

const article = `
UTEE BRAND ® Basic Cuban Shirt

• Chất liệu : Premium COTTON silk - Mềm mịn, dày dặn, không nhăn, không ra màu kể cả khi giặt máy.
• Size: M / L / XL
• Chữ UTEE STUDIO thương hiệu được thêu tỉ mỉ, tinh tế.

Xem từng ảnh để thấy những chi tiết thú vị nhé!

Được chăm chút từ chất liệu, form dáng, đường may, hình in cho đến khâu đóng gói và hậu mãi, chiếc sơ mi Cuban xinh xẻo này sẽ làm hài lòng cả những vị khách khó tính nhất.

#thoitrangnam #thoitrangnu #somi #unisex #u.tee #giamgiamanh #giamgia #sơmi #unisex #utee #cottonlạnhsiêumátsiêudẹp #cottonlanh
#somioversize #somicaocap #sominam
#aki #utee #tshirt #somi #unisex #streetstyle
`;

const ProductCard = ({ product }) => {
  if (product === null) {
    return <p className="text-center text-red-500">Sản phẩm không tồn tại</p>;
  }
  const [quantity, setQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(null);

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
    <div className="bg-[#f5f5f5]">
      <div className="rounded overflow-hidden shadow-lg bg-white p-6 my-4 border border-gray-100 min-h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Image Slider */}
          {isSlider && <ProductImageSlider images={product.product_images} />}
          {!isSlider && <ProductImageSlider images={[1, 2, 3, 4]} />}
          {/* Right: Product Details */}
          <div>
            <ProductInfo
              name={product.product_basic_info.name}
              rating={product.product_basic_info.rating}
              reviews={product.reviews}
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

      <Shop shopInfo={product.shop_response} />

      <ProductAttribute
        productAttributes={product.product_attribute_value_responses}
      />

      <ProductDescription
        description={product.product_basic_info.description}
      />

      <ProductReview />
    </div>
  );
};
// Product Image Slider Component
export default ProductCard;
