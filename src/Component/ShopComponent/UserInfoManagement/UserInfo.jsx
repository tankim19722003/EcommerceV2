import { useState, useEffect, useRef } from "react";
import { api } from "../../../config/interceptor-config";
import UserInfoSidebar from "./UserInfoSidebar";

export default function ProfilePage() {
  const [user, setUser] = useState({
    account: "",
    fullname: "",
    email: "",
    phone_number: "",
    gender: false,
    birth_date: "",
    avatar_url: "",
    address: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const prevAvatarUrlRef = useRef(null); // Track previous object URL for cleanup
  const fileInputRef = useRef(null); // Ref for file input
  const previewId = useRef(0); // Unique identifier for preview re-render

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("user"));
    if (storedData && storedData.user) {
      setUser({
        account: storedData.user.account || "",
        fullname: storedData.user.fullname || "",
        email: storedData.user.email || "",
        phone_number: storedData.user.phone_number || "",
        gender: storedData.user.gender === true,
        birth_date: storedData.user.birth_date || "",
        avatar_url: storedData.user.avatar_url || "",
        address: storedData.user.address || "",
      });
    }

    // Cleanup object URL on component unmount
    return () => {
      if (prevAvatarUrlRef.current) {
        URL.revokeObjectURL(prevAvatarUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (avatarFile) {
      const newUrl = URL.createObjectURL(avatarFile);
      console.log("New preview URL generated:", newUrl); // Debug log
      // Revoke previous URL if exists
      if (prevAvatarUrlRef.current) {
        URL.revokeObjectURL(prevAvatarUrlRef.current);
      }
      prevAvatarUrlRef.current = newUrl;
      previewId.current += 1; // Increment for re-render
      console.log("Preview ID updated:", previewId.current); // Debug log
    }
  }, [avatarFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "gender") {
      setUser({ ...user, gender: value === "Nam" });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (1 MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        alert("File ảnh vượt quá giới hạn 1 MB!");
        e.target.value = null; // Reset input
        return;
      }
      setAvatarFile(file); // Trigger preview update via useEffect
      fileInputRef.current.value = null; // Reset file input
      console.log("File selected:", file.name); // Debug log
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("account", user.account);
      formData.append("fullname", user.fullname);
      formData.append("address", user.address);
      formData.append("gender", user.gender);
      // Convert birth_date to ISO string for Date compatibility
      const birthDateISO = user.birth_date
        ? new Date(user.birth_date).toISOString()
        : "";
      formData.append("birthdate", birthDateISO);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await api.put("/user/update_user_info", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update avatar_url if backend returns a new URL
      const updatedUser = response.data; // Adjust based on actual response structure
      if (updatedUser.avatar_url) {
        if (prevAvatarUrlRef.current) {
          URL.revokeObjectURL(prevAvatarUrlRef.current);
          prevAvatarUrlRef.current = null;
        }
        setUser((prev) => ({ ...prev, avatar_url: updatedUser.avatar_url }));
        setAvatarFile(null); // Clear file after successful upload
        previewId.current += 1; // Force re-render after save
      }

      alert("Cập nhật thành công!");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user")),
          user: {
            ...user,
            avatar_url: updatedUser.avatar_url || user.avatar_url,
          },
        })
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Profile Form */}
      <UserInfoSidebar avatarUrl={user.avatar_url} account={user.account} />
      <div className="flex-1 pt-6 pr-6 pb-6 lg:pt-8 lg:pr-8 lg:pb-8">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Hồ Sơ Của Tôi
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 leading-8">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  name="account"
                  value={user.account}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600 "
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 leading-8">Tên</label>
                <input
                  type="text"
                  name="fullname"
                  value={user.fullname}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 leading-8">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={user.email}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 leading-8">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={user.phone_number || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label
                  className="
                 text-sm font-medium text-gray-700 leading-8"
                >
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={user.address || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 leading-8">
                  Giới tính
                </label>
                <div className="flex space-x-6 mt-2">
                  {["Nam", "Nữ", "Khác"].map((g) => (
                    <label key={g} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={user.gender === (g === "Nam")}
                        onChange={handleChange}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-gray-700">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 leading-8">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={user.birth_date || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="cursor-pointer bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition duration-200"
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center">
              <img
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : user.avatar_url || "https://via.placeholder.com/100"
                }
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-gray-200"
                key={previewId.current} // Force re-render on preview change
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="avatar"
                accept="image/jpeg,image/png"
                ref={fileInputRef}
              />
              <label
                htmlFor="avatar"
                className="cursor-pointer bg-orange-100 text-orange-600 px-6 py-2 rounded-lg hover:bg-orange-200 transition duration-200"
              >
                Chọn Ảnh
              </label>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Dung lượng file tối đa 1 MB
                <br /> Định dạng: .JPEG, .PNG
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
