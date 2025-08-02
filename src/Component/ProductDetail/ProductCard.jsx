import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { addItemToCart } from "../../Http/CartHttp";
import Swal from "sweetalert2";

// Main Product Card Component
const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  if (product === null) {
    return <p className="text-center text-red-500">Sản phẩm không tồn tại</p>;
  }

  function handleSetMaxQuantity(quantity) {
    setMaxQuantity(quantity);
  }

  let price = 0;
  const productCategoryResponse = product.product_category_responses;
  const productCategoryOneLevel = productCategoryResponse?.product_category_one_level_responses;
  const productCategoryTwoLevel = productCategoryResponse?.product_category_two_level;

  if (productCategoryOneLevel?.length > 0) {
    price = productCategoryOneLevel[0].price;
  } else if (productCategoryTwoLevel?.length > 0) {
    price = productCategoryTwoLevel[0].child_product_category_responses[0].price;
  }

  const isSlider = product.product_images?.length > 0;


  const handleBuyNow = async () => {
    try {
      const cartItemId = await handleAddToCart();
      navigate("/cart", { state: { selectedCartItemId: cartItemId } });
    } catch (error) {
      // Error already handled in handleAddToCart
    }
  };
  const handleAddToCart = async () => {
  try {
    // ─── Xác định category/subcategory như bạn đã làm ──────────────
    let product_category_id = "";
    let product_subcategory_id = "";

    if (selectedCategory) {
      if (productCategoryOneLevel?.length > 0) {
        product_category_id = selectedCategory.id;
      } else if (productCategoryTwoLevel?.length > 0) {
        product_category_id = findParentCategoryById(selectedCategory.id).product_category_response.id;
        product_subcategory_id = selectedCategory.id;
      }
    } else {
      if (productCategoryOneLevel?.length > 0) {
        product_category_id = productCategoryOneLevel[0].id;
      } else if (productCategoryTwoLevel?.length > 0) {
        product_category_id = productCategoryTwoLevel[0].id;
        product_subcategory_id =
          productCategoryTwoLevel[0].child_product_category_responses[0].id;
      }
    }

    const cartData = {
      product_id: product.product_basic_info.product_id,
      quantity,
      product_category_id,
      product_subcategory_id,
    };

    // ─── Gọi API ──────────────────────────────────────────────────
    const cartItem = await addItemToCart(cartData);

    // ─── SweetAlert thành công ───────────────────────────────────
    Swal.fire({
      icon: "success",
      title: "Đã thêm vào giỏ!",
      text: "Sản phẩm đã được thêm vào giỏ hàng của bạn.",
      confirmButtonColor: "#3085d6",
    });

    return cartItem.id;

    // Optional: navigate("/cart");
  } catch (error) {
    console.error("Error adding to cart:", error);

    // ─── SweetAlert lỗi ──────────────────────────────────────────
    Swal.fire({
      icon: "error",
      title: "Thao tác thất bại",
      text: "Không thể thêm sản phẩm. Vui lòng thử lại!",
      confirmButtonColor: "#d33",
    });
  }
};

const findParentCategoryById = (childId) => {
  for (const category of productCategoryTwoLevel) {
    const matchingChild = category.child_product_category_responses.find(
      (subCategory) => subCategory.id === childId
    );
    if (matchingChild) {
      return category;
    }
  }
  return null;
};


  return (
    <div className="bg-[#f5f5f5]">
      <div className="rounded overflow-hidden shadow-lg bg-white p-6 my-4 border border-gray-100 min-h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isSlider ? (
            <ProductImageSlider images={product.product_images} />
          ) : (
            <ProductImageSlider images={[1, 2, 3, 4]} />
          )}
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
            {productCategoryTwoLevel?.length > 0 && (
              <ProductCategoryTwoLevel
                data={productCategoryResponse}
                setMaxQuantity={handleSetMaxQuantity}
                setQuantity={setQuantity}
                setSelectedCategory={setSelectedCategory}
              />
            )}
            {productCategoryOneLevel?.length > 0 && (
              <ProductCategoryOneLevel
                productCategoryResponses={productCategoryOneLevel}
                setMaxProductCategory={handleSetMaxQuantity}
                setSelectedCategory={setSelectedCategory}
              />
            )}
            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              maxQuantity={maxQuantity}
              isDisabled={maxQuantity === null}
            />
            <ActionButtons
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart} // Pass the new function
            />
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
      <ProductReview ratingSumarry = {product.product_rating_counts} productRating={product.product_basic_info.rating}/>
    </div>
  );
};

export default ProductCard;