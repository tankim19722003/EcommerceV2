import Icon from "../Share/Icon";
import bell from "../../assets/bell.png";
import helpCircle from "../../assets/question.png";
import global from "../../assets/global.png";
import searchIcon from "../../assets/search.png";
import shoppingCart from "../../assets/shopping-cart.png";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../../store/user-slice";
import UserDropdown from "../User/UserDropdown";

function Header() {
  const user = useSelector((state) => state.user.user);
  // const toggleMenu = () => setOpen(!open);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(userAction.logout());
    // you can add navigation or other logout effects here
  };
  return (
    <div className="w-full bg-gradient-to-r from-blue-500 to-teal-500 p-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center px-4 w-full">
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-lg font-bold cursor-pointer">
                Ecommerce
              </Link>
              <div className="h-5 w-px bg-gray-400"></div>

              <Link to="/shop-registration" className="text-sm">Kênh Người Bán</Link>
              <div className="h-5 w-px bg-gray-400"></div>

              <div className="text-sm">Trở thành Người bán Shopee</div>
              <div className="h-5 w-px bg-gray-400"></div>

              <div className="text-sm">Tải ứng dụng</div>
              <div className="h-5 w-px bg-gray-400"></div>

              <div className="text-sm flex items-center gap-2">
                <span>Kết nối</span>
                <div className="flex gap-2">
                  <i className="fab fa-facebook-f"></i>
                  <i className="fab fa-instagram"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Icon>
              <img src={bell} alt="Bell icon" />
            </Icon>

            <Icon>
              <img src={helpCircle} alt="Help Circle icon" />
            </Icon>

            <Icon>
              <img src={global} alt="Help Circle icon" />
            </Icon>

            <div className="text-sm text-white">Tiếng Việt</div>

            {/* show login button when not login */}
            {!user && (
              <>
                <Link to="/register" className="text-sm text-white">
                  Đăng Ký
                </Link>
                <Link to="/login" className="text-sm text-white cursor-pointer">
                  Đăng Nhập
                </Link>
              </>
            )}

            {user && <UserDropdown user={user}/>}
          </div>
        </div>

        <div className="mt-4 flex justify-center items-center gap-4">
          <div className="relative w-full max-w-lg flex items-center bg-white rounded-md shadow-md">
            <input
              type="text"
              className="w-full h-12 px-4 py-2 rounded-l-md outline-none bg-white text-gray-800 placeholder-gray-500"
              placeholder="Tìm sản phẩm, thương hiệu, và tên shop"
            />
            <Icon>
              <img src={searchIcon} alt="search icon" className="w-5 h-5" />
            </Icon>
          </div>

          <div>
            <Icon>
              <img src={shoppingCart} alt="shopping cart" className="w-6 h-6" />
            </Icon>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
