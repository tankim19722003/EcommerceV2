import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { userAction } from "../../store/user-slice";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import EcommerceSpinner from "../Share/EcommerceSpinner";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameError(!username);
    setPasswordError(!password);

    try {
      setIsLoggingIn(true);
      const response = await fetch("http://localhost:8080/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: username,
          password,
        }),
      });
      setIsLoggingIn(false);

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Sai mật khẩu hoặc tên đăng nhập rồi",
        });
        return;
      }

      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data));
      dispatch(userAction.login(data.user));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const loginWithFacebook = () => {
  };

  const loginWithGoogle = () => {
  };


  return (
    <>
    {isLoggingIn && <EcommerceSpinner text="Đang đăng nhập..."/>}
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200 sm:p-10">
        <h2 className="text-3xl font-extrabold text-center text-red-600 mb-8 tracking-tight">
          Đăng Nhập
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Email/Số điện thoại/Tên đăng nhập
            </label>
            <input
              type="text"
              placeholder="Nhập email, số điện thoại hoặc tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300 bg-gray-50 text-gray-800 placeholder-gray-400 ${
                usernameError ? "border-red-500" : ""
              }`}
            />
            {usernameError && (
              <p className="text-red-500 text-xs mt-1">
                Vui lòng nhập thông tin hợp lệ
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300 bg-gray-50 text-gray-800 placeholder-gray-400 ${
                passwordError ? "border-red-500" : ""
              }`}
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">
                Vui lòng nhập mật khẩu
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            ĐĂNG NHẬP
          </button>
        </form>
        <div className="mt-4 text-center">
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-200"
          >
            Quên mật khẩu
          </a>
        </div>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">HOẶC</span>
            </div>
          </div>
          {/* <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={loginWithFacebook}
              className="flex items-center justify-center gap-2 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
              Facebook
            </button>
            <button
              onClick={loginWithGoogle}
              className="flex items-center justify-center gap-2 bg-white text-gray-800 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-300 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v2.36h3.26c-.14.86-.98 2.53-3.26 2.53-1.96 0-3.56-1.62-3.56-3.62s1.6-3.62 3.56-3.62c1.11 0 1.85.59 2.28 1.1l1.61-1.54C16.32 5.96 14.56 5 12.48 5 8.92 5 6 7.92 6 11.48s2.92 6.48 6.48 6.48c3.74 0 6.23-2.62 6.23-6.31 0-.42-.04-.79-.11-1.17h-6.12z" />
              </svg>
              Google
            </button>
          </div> */}
        </div>
        <p className="text-sm mt-6 text-center text-gray-600">
          Bạn mới biết Shop Mind?{" "}
          <Link
            to="/register"
            className="text-red-600 hover:text-red-800 hover:underline transition duration-200"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default LoginForm;
