import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAllProvinces,
  getDistrictsByProvinceId,
  getVillageByDistrictId,
} from "../../Http/AddressHttp";
import { registerShop } from "../../Http/ShopRegistrationHttp";
import {
  requestEmailConfirmationCode,
  verifyEmailConfirmationCode,
} from "../../Http/EmailHttp";
import Swal from "sweetalert2";
import { GiConfirmed } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const ShopRegistrationForm = () => {
  const user = useSelector((state) => state.user.user);
  const navigate  = useNavigate();
  const [formData, setFormData] = useState({
    shopName: "",
    description: "",
    province: "",
    district: "",
    villageId: "",
    village: "",
    specificAddress: "",
    phoneNumber: "",
    email: "",
    emailConfirmCode: "",
    frontCccd: null,
    behindCccd: null,
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [village, setVillage] = useState([]);
  const [isNewCodeRequestDisabled, setIsNewCodeRequestDisabled] =
    useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [isVerifySuccessfully, setIsVerifySuccessfully] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // check if shop is already registered
  useEffect(() => {
    if (!user) {
      // User is not logged in, handle accordingly
      Swal.fire({
        icon: "warning",
        title: "Bạn chưa đăng nhập",
        text: "Vui lòng đăng nhập để đăng ký shop.",
      });

      navigate("/login");
    }

    for (const role of user.roles) {
      if (role === "shop") {
        navigate("/shop-page");
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    try {
      setIsSubmitting(true);
      await registerShop({
        shopName: formData.shopName,
        description: formData.description,
        villageId: formData.villageId,
        specificAddress: formData.specificAddress,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        emailConfirmCode: formData.emailConfirmCode,
        frontCccd: formData.frontCccd,
        behindCccd: formData.behindCccd,
        userId: user.id,
      });
      setIsSubmitting(false);

      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công",
        text: "Bạn có thể bắt đầu bán hàng trên shop của chúng tôi!!",
      });
    } catch (error) {
      console.error("Failed to register shop:", error);
      setIsSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại",
        text: error.message || "Vui lòng kiểm tra lại thông tin và thử lại.",
      });
      return;
    }
  };

  const requestEmailCode = async () => {
    if (!formData.email) {
      alert("Vui lòng nhập email trước khi yêu cầu mã xác nhận");
      return;
    }

    try {
      setIsNewCodeRequestDisabled(true);
      setCountdown(30);
      setIsConfirmMode(true);

      // Replace with your actual API call to request the email confirmation code
      requestEmailConfirmationCode(user.id, formData.email);

      // Start countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsNewCodeRequestDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to request email code:", error);
      setIsNewCodeRequestDisabled(false);
      setIsConfirmMode(false);
      setCountdown(30);
    }
  };

  const confirmEmailCode = async () => {
    if (formData.emailConfirmCode) {
      try {
        const response = await verifyEmailConfirmationCode(
          user.id,
          formData.email,
          formData.emailConfirmCode
        );

        if (response) {
          setIsVerifySuccessfully(true);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Mã xác nhận email không hợp lệ",
        });
      }
    }
  };

  const requestNewCode = () => {
    if (isNewCodeRequestDisabled) return; // Prevent action during countdown
    setIsConfirmMode(false);
    setFormData({ ...formData, emailConfirmCode: "" }); // Clear previous code
    requestEmailCode(); // Trigger new code request
  };

  useEffect(() => {
    async function fetchProvinces() {
      const province = await getAllProvinces();
      setProvinces(province);
    }
    fetchProvinces();
  }, []);

  const getDistrictsById = async (e) => {
    setVillage([]);
    const provinceId = e.target.value;
    setFormData({
      ...formData,
      province: provinceId,
      district: "",
      villageId: "",
    });
    const districts = await getDistrictsByProvinceId(provinceId);
    if (districts) {
      setDistricts(districts);
    } else {
      console.error("Failed to fetch districts");
    }
  };

  const getVillage = async (e) => {
    const districtId = e.target.value;
    setFormData({ ...formData, district: districtId, villageId: "" });
    const villages = await getVillageByDistrictId(districtId);
    if (villages) {
      setVillage(villages);
    } else {
      console.error("Failed to fetch villages");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 sm:p-10 bg-white shadow-2xl rounded-2xl space-y-8 border border-gray-100 my-10"
    >
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-900 tracking-tight">
        Đăng Ký Mở Shop
      </h2>

      {/* Shop Info */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Tên Shop <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="shopName"
            placeholder="Nhập tên shop của bạn"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out bg-gray-50"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Mô Tả
          </label>
          <textarea
            name="description"
            placeholder="Mô tả ngắn gọn về shop của bạn..."
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out bg-gray-50 resize-none"
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Địa Chỉ Shop</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Tỉnh/Thành Phố <span className="text-red-500">*</span>
            </label>
            <select
              name="province"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50"
              onChange={getDistrictsById}
              required
            >
              <option value="">-- Chọn tỉnh --</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <select
              name="district"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50"
              onChange={getVillage}
              disabled={!formData.province}
              required
            >
              <option value="">-- Chọn quận --</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <select
              name="village"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50"
              onChange={(e) =>
                setFormData({ ...formData, villageId: e.target.value })
              }
              disabled={!formData.district}
              required
            >
              <option value="">-- Chọn phường --</option>
              {village.map((villageItem) => (
                <option key={villageItem.id} value={villageItem.id}>
                  {villageItem.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Địa Chỉ Cụ Thể<span className="text-red-500"> *</span>
          </label>
          <input
            type="text"
            name="specificAddress"
            placeholder="Ví dụ: 123 Đường Lê Lợi, P. Bến Nghé"
            className="w-full border border-graycola-300 rounded-lg px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Thông Tin Liên Hệ
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Số Điện Thoại
            </label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="0901234567"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              disabled={isVerifySuccessfully}
              placeholder="example@gmail.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Mã Xác Nhận Email <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  name="emailConfirmCode"
                  placeholder="Nhập mã xác nhận email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50"
                  onChange={handleChange}
                  disabled={isVerifySuccessfully}
                  required
                />

                {/* show form if does not verify successfully */}
                {!isVerifySuccessfully && (
                  <button
                    type="button"
                    onClick={
                      isConfirmMode ? confirmEmailCode : requestEmailCode
                    }
                    disabled={false}
                    className={`px-6 py-3 min-w-[150px] whitespace-nowrap rounded-xl text-base font-semibold transition duration-300 bg-blue-600 text-white hover:bg-blue-700`}
                  >
                    {isConfirmMode
                      ? "Xác nhận"
                      : isNewCodeRequestDisabled
                      ? `Đang gửi (${countdown}s)`
                      : "Gửi mã"}
                  </button>
                )}

                {/* show this icon if confirm email successfully */}
                {isVerifySuccessfully && (
                  <GiConfirmed className="text-green-500 text-3xl" />
                )}
              </div>
              {!isVerifySuccessfully && isConfirmMode && (
                <button
                  type="button"
                  onClick={requestNewCode}
                  disabled={isNewCodeRequestDisabled}
                  className={`text-sm ${
                    isNewCodeRequestDisabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-800"
                  } underline`}
                >
                  {isNewCodeRequestDisabled
                    ? `Yêu cầu mã xác nhận mới (${countdown}s)`
                    : "Yêu cầu mã xác nhận mới"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CCCD Upload */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Tài Liệu Xác Minh
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Mặt Trước CCCD
            </label>
            <div className="relative">
              <input
                type="file"
                name="frontCccd"
                accept="image/*"
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-600 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-gray-50 cursor-pointer"
                onChange={handleChange}
              />
              {formData.frontCccd && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-xs">
                  {formData.frontCccd.name}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Mặt Sau CCCD
            </label>
            <div className="relative">
              <input
                type="file"
                name="behindCccd"
                accept="image/*"
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-600 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-gray-50 cursor-pointer"
                onChange={handleChange}
              />
              {formData.behindCccd && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-xs">
                  {formData.behindCccd.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="text-center mt-8">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-12 py-3 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
        >
          {isSubmitting ? "Đang gửi..." : "Đăng Ký Shop"}
        </button>
      </div>
    </form>
  );
};

export default ShopRegistrationForm;
