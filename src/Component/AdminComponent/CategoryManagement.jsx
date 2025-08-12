import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit,
  Trash,
  X,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  createCategory,
  createSubcategory,
  getCategories,
  getSubcategoryByCategoryId,
} from "../../Http/CategoryHttp";
import Swal from "sweetalert2";
import AttributeTab from "./AttributeTab";
import { getAttributes } from "../../Http/AttributeHttp";
import { createSubcategoryAttribute } from "../../Http/SubcategoryAttributeHttp";
import EcommerceSpinner from "../Share/EcommerceSpinner";

const CategoryManagement = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [activeTab, setActiveTab] = useState("categories");
  const [editState, setEditState] = useState({
    type: null,
    id: null,
    categoryId: null,
    subcategoryId: null,
    name: "",
  });
  const [addState, setAddState] = useState({
    type: null,
    categoryId: null,
    subcategoryId: null,
    name: "",
    image: null,
    attributeId: null,
  });
  const [attributes, setAttributes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsFetching(true);
        const data = await getCategories();
        const formattedData = data.map((category) => ({
          ...category,
          subcategories: category.subcategories || [],
        }));
        setCategories(formattedData);
      } catch (error) {
        Swal.fire("Error!", "Failed to fetch categories!", "error");
      } finally {
        setIsFetching(false);
      }
    };

    const fetchAttributes = async () => {
      try {
        const response = await getAttributes();
        setAttributes(response);
      } catch (error) {
        Swal.fire("Error!", "Failed to fetch attributes!", "error");
      }
    };

    fetchCategories();
    fetchAttributes();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCancel(false);
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleCancel(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const fetchSubcategories = async (categoryId) => {
    try {
      setIsFetching(true);
      const data = await getSubcategoryByCategoryId(categoryId);
      const formattedData = data.map((subcategory) => ({
        ...subcategory,
        attributes: subcategory.attributes || [],
      }));
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? { ...cat, subcategories: formattedData } : cat
        )
      );
    } catch (error) {
      Swal.fire(
        "Error!",
        `Danh mục với ID ${categoryId} không tồn tại`,
        "error"
      );
    } finally {
      setIsFetching(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(categoryId);
      const category = categories.find((cat) => cat.id === categoryId);
      if (category.subcategories.length === 0) {
        fetchSubcategories(categoryId);
      }
    }
  };

  const startAdd = (type, categoryId = null, subcategoryId = null) => {
    setAddState({
      type,
      categoryId,
      subcategoryId,
      name: "",
      image: null,
      attributeId: null,
    });
    if (type === "category") {
      setIsModalOpen(true);
    }
  };

  const startEdit = (type, item, categoryId = null, subcategoryId = null) => {
    setEditState({
      type,
      id: item.id,
      categoryId,
      subcategoryId,
      name: item.name,
    });
  };

  const handleInputChange = (e, isEdit = false) => {
    const state = isEdit ? editState : addState;
    const setState = isEdit ? setEditState : setAddState;
    const { name, value, files } = e.target;
    if (name === "image") {
      console.log("Selected file:", files[0]); // Debug log
      setState({ ...state, image: files[0] || null });
    } else {
      const val = name === "attributeId" ? Number(value) : value;
      setState({ ...state, [name]: val });
    }
  };

  const handleSubmit = async (e, isEdit = false) => {
    e.preventDefault();
    const state = isEdit ? editState : addState;
    const { type, id, categoryId, subcategoryId, name, attributeId, image } =
      state;

    if (type === "category") {
      if (isEdit) {
        setCategories(
          categories.map((cat) => (cat.id === id ? { ...cat, name } : cat))
        );
        Swal.fire("Success!", "Cập nhật danh mục thành công!", "success");
      } else {
        if (!image) {
          Swal.fire("Error!", "Vui lòng chọn hình ảnh danh mục!", "error");
          return;
        }
        try {
          setIsFetching(true);
          const formData = new FormData();
          formData.append("name", name);
          formData.append("image", image);
          // Debug FormData contents
          for (let [key, value] of formData.entries()) {
            console.log(`FormData ${key}:`, value);
          }
          const newCategory = await createCategory(formData);
          setCategories([
            { id: newCategory.id, name, subcategories: [] },
            ...categories,
          ]);
          Swal.fire("Success!", "Tạo danh mục thành công!", "success");
          setIsModalOpen(false);
        } catch (error) {
          console.error("Error creating category:", error);
          Swal.fire("Error!", "Tạo danh mục thất bại!", "error");
        } finally {
          setIsFetching(false);
        }
      }
    } else if (type === "subcategory") {
      if (isEdit) {
        setCategories(
          categories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  subcategories: cat.subcategories.map((sub) =>
                    sub.id === id ? { ...sub, name } : sub
                  ),
                }
              : cat
          )
        );
        Swal.fire("Success!", "Cập nhật danh mục con thành công!", "success");
      } else {
        try {
          setIsFetching(true);
          const newSubcategory = await createSubcategory({ name, categoryId });
          setCategories(
            categories.map((cat) =>
              cat.id === categoryId
                ? {
                    ...cat,
                    subcategories: [
                      { id: newSubcategory.id, name, attributes: [] },
                      ...cat.subcategories,
                    ],
                  }
                : cat
            )
          );
          Swal.fire("Success!", "Tạo danh mục con thành công!", "success");
        } catch (error) {
          Swal.fire("Error!", "Tạo danh mục con thất bại!", "error");
        } finally {
          setIsFetching(false);
        }
      }
    } else if (type === "attribute") {
      if (!attributeId) {
        Swal.fire("Error!", "Vui lòng chọn một thuộc tính!", "error");
        return;
      }
      if (isEdit) {
        setCategories(
          categories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  subcategories: cat.subcategories.map((sub) =>
                    sub.id === subcategoryId
                      ? {
                          ...sub,
                          attributes: sub.attributes.map((attr) =>
                            attr.id === id ? { ...attr, name } : attr
                          ),
                        }
                      : sub
                  ),
                }
              : cat
          )
        );
        Swal.fire("Success!", "Cập nhật thuộc tính thành công!", "success");
      } else {
        try {
          setIsFetching(true);
          const response = await createSubcategoryAttribute({
            subcategory_id: subcategoryId,
            attribute_id: attributeId,
          });
          const selectedAttribute = attributes.find(
            (attr) => attr.id === attributeId
          );
          if (!selectedAttribute) {
            throw new Error("Thuộc tính không tồn tại");
          }
          setCategories(
            categories.map((cat) =>
              cat.id === categoryId
                ? {
                    ...cat,
                    subcategories: cat.subcategories.map((sub) =>
                      sub.id === subcategoryId
                        ? {
                            ...sub,
                            attributes: [
                              {
                                id: response.id || attributeId,
                                name: selectedAttribute.name,
                              },
                              ...sub.attributes,
                            ],
                          }
                        : sub
                    ),
                  }
                : cat
            )
          );
          Swal.fire("Success!", "Thêm thuộc tính thành công!", "success");
        } catch (error) {
          Swal.fire(
            "Error!",
            error.message || "Thêm thuộc tính thất bại!",
            "error"
          );
        } finally {
          setIsFetching(false);
        }
      }
    }
    setEditState({
      type: null,
      id: null,
      categoryId: null,
      subcategoryId: null,
      name: "",
    });
    setAddState({
      type: null,
      categoryId: null,
      subcategoryId: null,
      name: "",
      image: null,
      attributeId: null,
    });
  };

  const handleCancel = (isEdit = false) => {
    if (isEdit) {
      setEditState({
        type: null,
        id: null,
        categoryId: null,
        subcategoryId: null,
        name: "",
      });
    } else {
      setAddState({
        type: null,
        categoryId: null,
        subcategoryId: null,
        name: "",
        image: null,
        attributeId: null,
      });
      setIsModalOpen(false);
    }
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    if (expandedCategoryId === id) {
      setExpandedCategoryId(null);
    }
    Swal.fire("Success!", "Xóa danh mục thành công!", "success");
  };

  const handleDeleteSubcategory = (categoryId, subcategoryId) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.filter(
                (sub) => sub.id !== subcategoryId
              ),
            }
          : cat
      )
    );
    Swal.fire("Success!", "Xóa danh mục con thành công!", "success");
  };

  const handleDeleteAttribute = (categoryId, subcategoryId, attributeId) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.map((sub) =>
                sub.id === subcategoryId
                  ? {
                      ...sub,
                      attributes: sub.attributes.filter(
                        (attr) => attr.id !== attributeId
                      ),
                    }
                  : sub
              ),
            }
          : cat
      )
    );
    Swal.fire("Success!", "Xóa thuộc tính thành công!", "success");
  };

  if (isFetching) {
    return <EcommerceSpinner text="Đang tải dữ liệu..." />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
              activeTab === "categories"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-300"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            Quản lý danh mục
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
              activeTab === "createAttribute"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-300"
            }`}
            onClick={() => setActiveTab("createAttribute")}
          >
            Quản lý thuộc tính
          </button>
        </div>
      </div>

      {/* Category Management Tab */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Quản lý danh mục
            </h3>
            <button
              onClick={() => startAdd("category")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <Plus size={16} /> Thêm danh mục
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div
                    className="flex justify-between items-center mb-3 cursor-pointer"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-800">
                        {category.name}
                      </span>
                      {expandedCategoryId === category.id ? (
                        <ChevronUp size={16} className="text-gray-600" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-600" />
                      )}
                    </div>
                    {editState.type !== "category" ||
                    editState.id !== category.id ? (
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit("category", category);
                          }}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm"
                        >
                          <Edit size={16} /> Chỉnh sửa
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm"
                        >
                          <Trash size={16} /> Xóa
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startAdd("subcategory", category.id);
                          }}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm"
                        >
                          <Plus size={16} /> Thêm danh mục con
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                        <input
                          type="text"
                          name="name"
                          value={editState.name}
                          onChange={(e) => handleInputChange(e, true)}
                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 transition-shadow duration-200"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubmit(e, true);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
                          disabled={!editState.name}
                        >
                          <Check size={16} /> Cập nhật
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(true);
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm"
                        >
                          <X size={16} /> Hủy
                        </button>
                      </div>
                    )}
                  </div>
                  {addState.type === "subcategory" &&
                    addState.categoryId === category.id && (
                      <div className="ml-8 mb-3 flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm">
                        <input
                          type="text"
                          name="name"
                          value={addState.name}
                          onChange={(e) => handleInputChange(e, false)}
                          placeholder="Nhập tên danh mục con"
                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 transition-shadow duration-200"
                        />
                        <button
                          onClick={(e) => handleSubmit(e, false)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
                          disabled={!addState.name}
                        >
                          <Check size={16} /> Thêm
                        </button>
                        <button
                          onClick={() => handleCancel(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm"
                        >
                          <X size={16} /> Hủy
                        </button>
                      </div>
                    )}
                  {expandedCategoryId === category.id &&
                    category.subcategories.length > 0 && (
                      <ul className="ml-8 divide-y divide-gray-100">
                        {category.subcategories.map((subcategory) => (
                          <li
                            key={subcategory.id}
                            className="py-3 bg-gray-50 rounded-lg my-2 px-4 hover:bg-gray-100 transition-colors duration-150"
                          >
                            <div className="flex justify-between items-center">
                              {editState.type === "subcategory" &&
                              editState.id === subcategory.id &&
                              editState.categoryId === category.id ? (
                                <div className="flex items-center gap-3 w-full bg-white p-3 rounded-lg shadow-sm">
                                  <input
                                    type="text"
                                    name="name"
                                    value={editState.name}
                                    onChange={(e) => handleInputChange(e, true)}
                                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 transition-shadow duration-200"
                                  />
                                  <button
                                    onClick={(e) => handleSubmit(e, true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
                                    disabled={!editState.name}
                                  >
                                    <Check size={16} /> Cập nhật
                                  </button>
                                  <button
                                    onClick={() => handleCancel(true)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm"
                                  >
                                    <X size={16} /> Hủy
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="text-sm font-medium text-gray-700 border-l-4 border-blue-400 pl-3">
                                    {subcategory.name}
                                  </span>
                                  <div className="flex gap-3">
                                    <button
                                      onClick={() =>
                                        startEdit(
                                          "subcategory",
                                          subcategory,
                                          category.id
                                        )
                                      }
                                      className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm"
                                    >
                                      <Edit size={16} /> Sửa
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteSubcategory(
                                          category.id,
                                          subcategory.id
                                        )
                                      }
                                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm"
                                    >
                                      <Trash size={16} /> Xóa
                                    </button>
                                    <button
                                      onClick={() =>
                                        startAdd(
                                          "attribute",
                                          category.id,
                                          subcategory.id
                                        )
                                      }
                                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm"
                                    >
                                      <Plus size={16} /> Thêm thuộc tính
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                            {addState.type === "attribute" &&
                              addState.categoryId === category.id &&
                              addState.subcategoryId === subcategory.id && (
                                <div className="ml-6 mt-3 flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm">
                                  <select
                                    name="attributeId"
                                    value={addState.attributeId || ""}
                                    onChange={(e) =>
                                      handleInputChange(e, false)
                                    }
                                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 transition-shadow duration-200 bg-white"
                                  >
                                    <option value="" disabled>
                                      Chọn thuộc tính
                                    </option>
                                    {attributes
                                      .filter(
                                        (attr) =>
                                          !subcategory.attributes.some(
                                            (existingAttr) =>
                                              existingAttr.id === attr.id
                                          )
                                      )
                                      .map((attr) => (
                                        <option key={attr.id} value={attr.id}>
                                          {attr.name}
                                        </option>
                                      ))}
                                  </select>
                                  <button
                                    onClick={(e) => handleSubmit(e, false)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
                                    disabled={!addState.attributeId}
                                  >
                                    <Check size={16} /> Thêm
                                  </button>
                                  <button
                                    onClick={() => handleCancel(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm"
                                  >
                                    <X size={16} /> Hủy
                                  </button>
                                </div>
                              )}
                            {subcategory.attributes.length > 0 && (
                              <ul className="ml-6 mt-3 space-y-2">
                                {subcategory.attributes.map((attribute) => (
                                  <li
                                    key={attribute.id}
                                    className="flex justify-between items-center text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-2 hover:bg-gray-200 transition-colors duration-150 shadow-sm"
                                  >
                                    {editState.type === "attribute" &&
                                    editState.id === attribute.id &&
                                    editState.categoryId === category.id &&
                                    editState.subcategoryId ===
                                      subcategory.id ? (
                                      <div className="flex items-center gap-3 w-full bg-white p-3 rounded-lg shadow-sm">
                                        <input
                                          type="text"
                                          name="name"
                                          value={editState.name}
                                          onChange={(e) =>
                                            handleInputChange(e, true)
                                          }
                                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 transition-shadow duration-200"
                                        />
                                        <button
                                          onClick={(e) => handleSubmit(e, true)}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
                                          disabled={!editState.name}
                                        >
                                          <Check size={16} /> Cập nhật
                                        </button>
                                        <button
                                          onClick={() => handleCancel(true)}
                                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm"
                                        >
                                          <X size={16} /> Hủy
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <span className="border-l-4 border-green-400 pl-3 font-medium">
                                          {attribute.name}
                                        </span>
                                        <div className="flex gap-3">
                                          <button
                                            onClick={() =>
                                              startEdit(
                                                "attribute",
                                                attribute,
                                                category.id,
                                                subcategory.id
                                              )
                                            }
                                            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm"
                                          >
                                            <Edit size={16} /> Sửa
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteAttribute(
                                                category.id,
                                                subcategory.id,
                                                attribute.id
                                              )
                                            }
                                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm"
                                          >
                                            <Trash size={16} /> Xóa
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Create Attribute Tab */}
      {activeTab === "createAttribute" && (
        <AttributeTab categories={categories} setCategories={setCategories} />
      )}

      {/* Modal for Adding Category */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all duration-300 scale-100 sm:scale-105"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 id="modal-title" className="text-xl font-bold text-gray-900">
                Thêm danh mục mới
              </h3>
              <button
                onClick={() => handleCancel(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label="Đóng modal"
              >
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={(e) => handleSubmit(e, false)}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="category-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  id="category-name"
                  type="text"
                  name="name"
                  value={addState.name}
                  onChange={(e) => handleInputChange(e, false)}
                  placeholder="Nhập tên danh mục (ví dụ: Điện tử)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow duration-200 placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="category-image"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Hình ảnh danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  id="category-image"
                  type="file"
                  name="image"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => handleInputChange(e, false)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm transition-shadow duration-200 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                  required
                />
                {addState.image && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Xem trước hình ảnh:
                    </p>
                    <img
                      src={URL.createObjectURL(addState.image)}
                      alt="Category preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => handleCancel(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2 text-sm font-medium shadow-sm"
                >
                  <X size={18} /> Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!addState.name || !addState.image}
                >
                  <Check size={18} /> Thêm danh mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
