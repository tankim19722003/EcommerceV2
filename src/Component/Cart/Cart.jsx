import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../Share/Footer";
import CartItem from "./CartItem";
import { getAllCartItems } from "../../Http/CartHttp";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const Cart = () => {
  const user = useSelector((state) => state.user.user);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  // Flatten cartItems to get all individual items
  const allItems = cartItems.flatMap((shopGroup) =>
    shopGroup.cart_item_response.map((item) => ({
      ...item,
      shop_name: shopGroup.shop_info_response.shop_name,
    }))
  );

  // Calculate total price and count of selected items
  const selectedCartItems = allItems.filter(
    (item) =>
      Object.keys(selectedItems).length === 0 ||
      selectedItems[item.cart_item_id]
  );
  const total = selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = selectedCartItems.length;

  useEffect(() => {
    async function fetchAllCartItems() {
      try {
        const cartItems = await getAllCartItems();
        console.log("Fetched cart items:", cartItems);
        setCartItems(cartItems);

        const selectedCartItemId = location.state?.selectedCartItemId;

        if (!selectedCartItemId) {
          console.warn("No selectedCartItemId found in location.state");
          return;
        }

        setSelectedItems((prev) => ({
          ...prev,
          [selectedCartItemId]: true,
        }));

        window.history.replaceState({}, document.title, "/cart");
      } catch (error) {
        console.error("Error fetching cart items:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải giỏ hàng. Vui lòng thử lại!",
          confirmButtonColor: "#d33",
        });
      }
    }

    fetchAllCartItems();
  }, [location.state]);

  const handleQuantityChange = (item, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((shopGroup) => ({
        ...shopGroup,
        cart_item_response: shopGroup.cart_item_response.map((i) =>
          i.cart_item_id === item.cart_item_id
            ? { ...i, quantity: newQuantity }
            : i
        ),
      }))
    );
  };

  const handleToggleSelect = (item, isSelected) => {
    setSelectedItems((prev) => ({
      ...prev,
      [item.cart_item_id]: isSelected,
    }));
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newSelectedItems = allItems.reduce((acc, item) => {
      acc[item.cart_item_id] = isChecked;
      return acc;
    }, {});
    setSelectedItems(newSelectedItems);
  };

  const handleRemove = (item) => {
    setCartItems((prevItems) =>
      prevItems
        .map((shopGroup) => ({
          ...shopGroup,
          cart_item_response: shopGroup.cart_item_response.filter(
            (i) => i.cart_item_id !== item.cart_item_id
          ),
        }))
        .filter((shopGroup) => shopGroup.cart_item_response.length > 0)
    );
    setSelectedItems((prev) => {
      const newSelected = { ...prev };
      delete newSelected[item.cart_item_id];
      return newSelected;
    });
  };

  const handleRemoveSelected = () => {
    setCartItems((prevItems) =>
      prevItems
        .map((shopGroup) => ({
          ...shopGroup,
          cart_item_response: shopGroup.cart_item_response.filter(
            (item) => !selectedItems[item.cart_item_id]
          ),
        }))
        .filter((shopGroup) => shopGroup.cart_item_response.length > 0)
    );
    setSelectedItems({});
  };

  const handleBuy = () => {
    (selectedItems); // check what it is
    const selectedIds = getTrueIds(selectedItems); 
    if (selectedIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Chưa chọn sản phẩm nào!",
        text: "Vui lòng chọn ít nhất một sản phẩm trước khi thanh toán.",
        confirmButtonText: "OK",
      });
      return;
    }

    navigate("/payment", { state: { cartItems, selectedIds } });
  };

  // Guard against null / undefined just in case
  function getTrueIds(items = {}) {
    return Object.keys(items).map(Number);
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-4 flex justify-between items-center shadow-xl mb-6">
          <div className="flex space-x-4 sm:space-x-6 text-sm sm:text-base">
            <Link to={"/"} className="cursor-pointer text-gray-100 hover:text-white hover:underline transition duration-200">
              Trang chủ Shop mind
            </Link>
            <span className="cursor-pointer text-gray-100 hover:text-white hover:underline transition duration-200">
              Kết nối
            </span>
            <span className="cursor-pointer text-gray-100 hover:text-white hover:underline transition duration-200">
              Hỗ trợ
            </span>
          </div>
          <span className="font-semibold text-sm sm:text-base text-yellow-200 cursor-default">
            {user.account}
          </span>
        </header>

        <div className="border border-gray-200 p-4 sm:p-6 flex-grow rounded bg-white max-w-6xl mx-auto min-w-[1200px]">
          <div className="grid grid-cols-7 gap-6 mb-6 text-sm sm:text-base text-gray-700 text-center border-b border-gray-300 pb-4">
            <span className="tracking-wide font-semibold text-gray-600 py-2">
              Chọn
            </span>
            <span className="col-span-2 tracking-wide font-semibold text-gray-600 py-2">
              Sản Phẩm
            </span>
            <span className="tracking-wide font-semibold text-gray-600 py-2">
              Đơn Giá
            </span>
            <span className="tracking-wide font-semibold text-gray-600 py-2">
              Số Lượng
            </span>
            <span className="tracking-wide font-semibold text-gray-600 py-2">
              Số Tiền
            </span>
            <span className="tracking-wide font-semibold text-gray-600 py-2">
              Thao Tác
            </span>
          </div>

          <div className="space-y-4 min-h-[200px]">
            {cartItems.length > 0 ? (
              cartItems.map((shopGroup, index) => (
                <div key={index} className="p-4 rounded-lg shadow-sm">
                  <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
                    🏪
                    <span>{shopGroup.shop_info_response.shop_name}</span>
                  </h2>
                  {shopGroup.cart_item_response.map((item) => (
                    <CartItem
                      key={item.cart_item_id}
                      item={{
                        cart_item_id: item.cart_item_id,
                        name: item.product_name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.product_category_image.avatar_url,
                        type: item.product_category_name,
                      }}
                      onQuantityChange={handleQuantityChange}
                      onToggleSelect={handleToggleSelect}
                      onRemove={handleRemove}
                      isSelected={selectedItems[item.cart_item_id] || false}
                    />
                  ))}
                </div>
              ))
            ) : (
              <div className="grid grid-cols-7 gap-6 text-center text-gray-500 py-10">
                <span className="col-span-7">Giỏ hàng của bạn đang trống.</span>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-4 sm:p-6 shadow-2xl">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-4">
              <button className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 text-sm sm:text-base font-medium">
                <input
                  type="checkbox"
                  checked={
                    allItems.length > 0 &&
                    Object.values(selectedItems).every(Boolean)
                  }
                  onChange={handleSelectAll}
                  className="mr-2 w-4 h-4"
                />{" "}
                Chọn Tất Cả ({totalItems})
              </button>
              <button
                onClick={handleRemoveSelected}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 text-sm sm:text-base font-medium"
              >
                Xóa
              </button>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                Tổng cộng ({totalItems} sản phẩm):{" "}
              </span>
              <span className="text-orange-600 font-bold text-lg sm:text-xl">
                ₫{total.toLocaleString()}
              </span>
              <button
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition duration-200 text-sm sm:text-base font-medium"
                onClick={handleBuy}
              >
                Mua Hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;
