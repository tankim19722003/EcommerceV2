import { useRef, useState } from "react";
import Swal from "sweetalert2";
import EmailConfirmation from "./EmailConfirmation";
import {
  isValidEmail,
  isValidVietnamesePhoneNumber,
} from "../../validation/validation";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isFormShowing, setIsFormShowing] = useState(false);
  const navigate = useNavigate();

  const accountRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  // const handleRegister = async (e) => {
  //   e.preventDefault();

  //   // Call API to register
  //   try {
  //     const response = await fetch(
  //       "http://localhost:8080/api/v1/user/register",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           account: data.account,
  //           password: data.password,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const result = await response.json();
  //       throw new Error(result.message || "Đăng ký không thành công");
  //     }

  //     const result = await response.json();
  //     console.log("Registration successful:", result);
  //     Swal.fire({
  //       icon: "success",
  //       title: "Đăng ký thành công",
  //       text: "Bạn có thể đăng nhập ngay bây giờ.",
  //     });
  //     setTimeout(() => {
  //       window.location.href = "/login";
  //     }, 2000);
  //     // Redirect to login page or home page
  //   } catch (error) {
  //     console.error("Error during registration:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Đăng ký thất bại",
  //       text: error.message || "Vui lòng thử lại sau.",
  //     });
  //   }
  //   // add data return to context
  // };
  // const fd = new FormData(e.target);
  // const data = Object.fromEntries(fd.entries());
  // console.log("Form data:", data);

  // const phoneValid = isValidPhoneNumber(data.account, "VN");
  // const emailValid = validator.isEmail(data.account);

  // if (
  //   data.passowrd === "" ||
  //   data.account === "" ||
  //   data.confirmPassword === ""
  // ) {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Oops...",
  //     text: "Vui lòng nhập email hoặc số điện thoại",
  //   });
  //   return;
  // }

  // if (!phoneValid && !emailValid) {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Oops...",
  //     text: "Email hoặc số điện thoại không hợp lệ",
  //   });
  //   return;
  // }

  // if (data.password.length < 6) {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Oops...",
  //     text: "Mật khẩu phải có ít nhất 6 ký tự",
  //   });
  //   return;
  // }

  // if (data.password !== data.confirmPassword) {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Oops...",
  //     text: "Mật khẩu không khớp",
  //   });
  //   return;
  // }

  const handRegisterUser = async () => {
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    const account = accountRef.current.value;

    const phoneValid = isValidVietnamesePhoneNumber(account, "VN");
    const emailValid = isValidEmail(account);

    if (password === "" || account === "" || confirmPassword === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Vui lòng nhập email hoặc số điện thoại",
      });
      return;
    }


    if (!phoneValid && !emailValid) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email hoặc số điện thoại không hợp lệ",
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Mật khẩu phải có ít nhất 6 ký tự",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Mật khẩu không khớp",
      });
      return;
    }

    // call api to check existing email and password
    const response = await fetch(
      `http://localhost:8080/api/v1/user/exists?account=${account}`
    );

    console.log(response.ok);
    if (response.ok) {
      const isUserExisting = await response.json();

      if (isUserExisting) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Email hoặc số điện thoại đã tồn tại",
        });
        return;
      }
    }

    // email need to validate
    if (emailValid) {
      console.log("Go here");
      setIsFormShowing(true);

      // call api to send email
      await fetch(
        `http://localhost:8080/api/v1/user_code/send_code?email=${account}`
      );
      return;
    }

    // if phone number save to right away to server
    handleCreateUser();
  };

  async function handleCreateUser(account, password) {
    //   // Call API to register
    const response = await fetch("http://localhost:8080/api/v1/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: account,
        password: password,
      }),
    });

    if (response.ok) {
      navigate("/login");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Create user fail",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {isFormShowing && (
        <EmailConfirmation
          account={accountRef.current?.value}
          password={passwordRef.current?.value}
          handleCreateUser={handleCreateUser}
        />
      )}

      {!isFormShowing && (
        <div className="bg-white p-8 rounded shadow-md w-[380px] border border-gray-200">
          <h2 className="text-2xl font-semibold my-4">Đăng ký</h2>

          <form method="POST" className="space-y-4">
            <input
              placeholder="Email/Số điện thoại"
              ref={accountRef}
              name="account"
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                name="password"
                ref={passwordRef}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-sm text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </span>
            </div>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                ref={confirmPasswordRef}
                name="confirmPassword"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-sm text-gray-600"
                onClick={() => setShowConfirm((prev) => !prev)}
              >
                {showConfirm ? "Ẩn" : "Hiện"}
              </span>
            </div>

            <button
              onClick={handRegisterUser}
              type="button"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold"
            >
              ĐĂNG KÝ
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Bạn đã có tài khoản?
            <a href="/login" className="text-orange-500 ml-1 hover:underline">
              Đăng nhập
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
