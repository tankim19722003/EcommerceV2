import React, { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EmailConfirmation = ({ account, password, handleCreateUser }) => {
  const [code, setCode] = useState("");
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds cooldown
  const [canResend, setCanResend] = useState(false);
  const codeRef = useRef();

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [resendTimer]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Entered code:", code);
  //   // Call API to verify code
  // };

  const handleResend = () => {
    if (!canResend) return;

    console.log("Resending code...");
    // Call API to resend code
    setResendTimer(60); // restart timer
  };

  async function handleConfirmCode() {
    // call api to valid code
    const response = await fetch(
      "http://localhost:8080/api/v1/user_code/confirm_code",
      {
        method: "POST", // Specify HTTP method
        headers: {
          "Content-Type": "application/json", // Tell server you send JSON
        },
        body: JSON.stringify({
          email: account,
          code: codeRef.current.value,
        }),
      }
    );

    if (response.ok) {
      await handleCreateUser(account, password);
      return;
    }

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Mã đăng kí không hợp lệ",
    });

    // handleRegister();
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl border-gray-200 border-1">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Xác nhận email
      </h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Nhập mã xác nhận"
          ref={codeRef}
          className="w-full px-4 py-2 border-0 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />

        <button
          type="button"
          className="w-full bg-orange-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg cursor-pointer"
          onClick={handleConfirmCode}
        >
          XÁC NHẬN
        </button>
      </form>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleResend}
          disabled={!canResend}
          className={`text-blue-600 font-semibold ${
            !canResend ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Gửi lại mã
        </button>
        {!canResend && (
          <span className="text-gray-500 text-sm">
            Gửi lại sau {resendTimer}s
          </span>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmation;
