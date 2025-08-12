import { useEffect, useState } from "react";
import { api } from "../../../config/interceptor-config";
import UserInfoSidebar from "./UserInfoSidebar";
import { Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function UserAddressUpdating() {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [formData, setFormData] = useState({
    village_id: "",
    specific_address: "",
    receiver_name: "",
    phone_number: "",
    province_id: "",
    district_id: "",
  });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [userId, setUserId] = useState(5); // Adjust based on your auth context or API

  // Fetch addresses and provinces on mount
  useEffect(() => {
    api
      .get("/user_village/get_all_address")
      .then((res) => {
        setAddresses(res.data.addressResponses || []);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách địa chỉ:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể lấy danh sách địa chỉ. Vui lòng thử lại.",
          confirmButtonText: "OK",
          confirmButtonColor: "#0d9488",
        });
      });

    api
      .get("/user_village/get_all_provinces")
      .then((res) => {
        setProvinces(res.data || []);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách tỉnh:", err);
      });
  }, []);

  // Fetch districts when province_id changes or when editing an address
  useEffect(() => {
    if (formData.province_id) {
      api
        .get(`/user_village/get_all_districts/${formData.province_id}`)
        .then((res) => {
          setDistricts(res.data || []);
          // Only reset district_id and village_id if not editing
          if (!editingAddressId) {
            setFormData((prev) => ({ ...prev, district_id: "", village_id: "" }));
          }
          setVillages([]);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy danh sách huyện:", err);
        });
    } else {
      setDistricts([]);
      setVillages([]);
    }
  }, [formData.province_id, editingAddressId]);

  // Fetch villages when district_id changes or when editing an address
  useEffect(() => {
    if (formData.district_id) {
      api
        .get(`/user_village/get_all_villages/${formData.district_id}`)
        .then((res) => {
          setVillages(res.data || []);
          // Only reset village_id if not editing
          if (!editingAddressId) {
            setFormData((prev) => ({ ...prev, village_id: "" }));
          }
        })
        .catch((err) => {
          console.error("Lỗi khi lấy danh sách xã:", err);
        });
    } else {
      setVillages([]);
    }
  }, [formData.district_id, editingAddressId]);

  const setDefault = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.address_id === id,
      }))
    );
    // TODO: Send request to backend to save default address
  };

  const deleteAddress = (id) => {
    api
      .delete(`/user_village`, { params: { userAddressId: id } })
      .then(() => {
        setAddresses((prev) => prev.filter((addr) => addr.address_id !== id));
        Swal.fire({
          icon: "success",
          title: "Xóa thành công",
          text: "Địa chỉ đã được xóa khỏi danh sách.",
          confirmButtonText: "OK",
          confirmButtonColor: "#0d9488",
          timer: 2000,
        });
      })
      .catch((err) => {
        console.error("Lỗi khi xóa địa chỉ:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể xóa địa chỉ. Vui lòng thử lại.",
          confirmButtonText: "OK",
          confirmButtonColor: "#0d9488",
        });
      });
  };

  const editAddress = (address) => {
    setFormData({
      village_id: address.village_id || "",
      specific_address: address.specific_address || "",
      receiver_name: address.receiver_name || "",
      phone_number: address.phone_number || "",
      province_id: address.province_id || "",
      district_id: address.district_id || "",
    });
    setEditingAddressId(address.address_id);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      user_id: userId,
      village_id: Number(formData.village_id),
      specific_address: formData.specific_address,
      receiver_name: formData.receiver_name,
      phone_number: formData.phone_number,
    };

    if (editingAddressId) {
      // Update address
      api
        .put(`/user_village/update_user_address/${editingAddressId}`, payload)
        .then((res) => {
          setAddresses((prev) =>
            prev.map((addr) =>
              addr.address_id === editingAddressId ? res.data : addr
            )
          );
          setIsModalOpen(false);
          setEditingAddressId(null);
          setFormData({
            village_id: "",
            specific_address: "",
            receiver_name: "",
            phone_number: "",
            province_id: "",
            district_id: "",
          });
          Swal.fire({
            icon: "success",
            title: "Cập nhật thành công",
            text: "Địa chỉ đã được cập nhật.",
            confirmButtonText: "OK",
            confirmButtonColor: "#0d9488",
            timer: 2000,
          });
        })
        .catch((err) => {
          console.error("Lỗi khi cập nhật địa chỉ:", err);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể cập nhật địa chỉ. Vui lòng thử lại.",
            confirmButtonText: "OK",
            confirmButtonColor: "#0d9488",
          });
        });
    } else {
      // Add new address
      api
        .post("/user_village/add_user_address", payload)
        .then((res) => {
          setAddresses((prev) => [...prev, res.data]);
          setIsModalOpen(false);
          setFormData({
            village_id: "",
            specific_address: "",
            receiver_name: "",
            phone_number: "",
            province_id: "",
            district_id: "",
          });
          Swal.fire({
            icon: "success",
            title: "Thêm thành công",
            text: "Địa chỉ mới đã được thêm.",
            confirmButtonText: "OK",
            confirmButtonColor: "#0d9488",
            timer: 2000,
          });
        })
        .catch((err) => {
          console.error("Lỗi khi thêm địa chỉ:", err);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể thêm địa chỉ. Vui lòng thử lại.",
            confirmButtonText: "OK",
            confirmButtonColor: "#0d9488",
          });
        });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <UserInfoSidebar />
      <div className="flex-1 pt-6 pr-6 pb-6 lg:pt-8 lg:pr-8 lg:pb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">
              Địa Chỉ Của Tôi
            </h2>
            <button
              onClick={() => {
                setEditingAddressId(null);
                setFormData({
                  village_id: "",
                  specific_address: "",
                  receiver_name: "",
                  phone_number: "",
                  province_id: "",
                  district_id: "",
                });
                setIsModalOpen(true);
              }}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-2.5 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Thêm Địa Chỉ Mới
            </button>
          </div>
          {/* Address list */}
          <div className="space-y-6">
            {addresses.length > 0 ? (
              addresses.map((addr) => (
                <div
                  key={addr.address_id}
                  className="border-b border-gray-100 pb-6 last:border-none hover:bg-gray-50 transition-colors duration-200 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-lg text-gray-800">
                        {addr.receiver_name}
                      </span>{" "}
                      <span className="text-gray-500 text-sm">
                        (+84) {addr.phone_number}
                      </span>
                    </div>
                    <div className="space-x-4 flex items-center">
                      {!addr.isDefault && (
                        <button
                          onClick={() => deleteAddress(addr.address_id)}
                          className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                          Xóa
                        </button>
                      )}
                      <button
                        onClick={() => editAddress(addr)}
                        className="text-teal-500 hover:text-teal-600 font-medium transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
                        title="Cập nhật"
                      >
                        <Edit size={18} />
                        Cập nhật
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">
                    {addr.specific_address}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {addr.village_name}, {addr.district_name},{" "}
                    {addr.province_name}
                  </p>
                  <div className="flex items-center space-x-2 mt-3">
                    {addr.isDefault && (
                      <span className="bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Mặc định
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-10 text-lg">
                Không tìm thấy địa chỉ
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl transform transition-all duration-200 scale-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingAddressId ? "Cập Nhật Địa Chỉ" : "Thêm Địa Chỉ Mới"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  name="receiver_name"
                  value={formData.receiver_name}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors duration-150"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số Điện Thoại
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors duration-150"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tỉnh/Thành Phố
                </label>
                <select
                  name="province_id"
                  value={formData.province_id}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors duration-150"
                >
                  <option value="">Chọn Tỉnh/Thành Phố</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Quận/Huyện
                </label>
                <select
                  name="district_id"
                  value={formData.district_id}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.province_id}
                  className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Xã/Phường
                </label>
                <select
                  name="village_id"
                  value={formData.village_id}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.district_id}
                  className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Chọn Xã/Phường</option>
                  {villages.map((village) => (
                    <option key={village.id} value={village.id}>
                      {village.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Địa Chỉ Cụ Thể
                </label>
                <input
                  type="text"
                  name="specific_address"
                  value={formData.specific_address}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors duration-150"
                  placeholder="Nhập địa chỉ cụ thể"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAddressId(null);
                    setFormData({
                      village_id: "",
                      specific_address: "",
                      receiver_name: "",
                      phone_number: "",
                      province_id: "",
                      district_id: "",
                    });
                    setDistricts([]);
                    setVillages([]);
                  }}
                  className="px-4 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-all duration-150 text-sm font-medium cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-md hover:from-teal-600 hover:to-teal-700 transition-all duration-150 text-sm font-medium cursor-pointer"
                >
                  {editingAddressId ? "Cập Nhật" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}