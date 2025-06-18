import { useState, useEffect } from "react";
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
import { ClipLoader } from "react-spinners";
import AttributeTab from "./AttributeTab";
import { getAttributes } from "../../Http/AttributeHttp";
import { createSubcategoryAttribute } from "../../Http/SubcategoryAttributeHttp";

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
    attributeId: null, // Added to store selected attribute ID
  });
  const [attributes, setAttributes] = useState([]); // State for attribute list

  // Fetch categories and attributes on component mount
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
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
        Swal.fire("Error!", "Failed to fetch categories!", "error");
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

  // Fetch subcategories when a category is clicked
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
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      Swal.fire("Error!", `Danh mục với ID ${categoryId} không tồn tại`, "error");
    }
  };

  // Handle category click to toggle subcategories
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

  // Handle opening inline input for add
  const startAdd = (type, categoryId = null, subcategoryId = null) => {
    setAddState({ type, categoryId, subcategoryId, name: "", attributeId: null });
  };

  // Handle opening inline input for edit
  const startEdit = (type, item, categoryId = null, subcategoryId = null) => {
    setEditState({
      type,
      id: item.id,
      categoryId,
      subcategoryId,
      name: item.name,
    });
  };

  // Handle input change for add/edit
  const handleInputChange = (e, isEdit = false) => {
    const state = isEdit ? editState : addState;
    const setState = isEdit ? setEditState : setAddState;
    const value = e.target.name === "attributeId" ? Number(e.target.value) : e.target.value;
    setState({ ...state, [e.target.name]: value });
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e, isEdit = false) => {
    e.preventDefault();
    const state = isEdit ? editState : addState;
    const { type, id, categoryId, subcategoryId, name, attributeId } = state;

    if (type === "category") {
      if (isEdit) {
        setCategories(
          categories.map((cat) => (cat.id === id ? { ...cat, name } : cat))
        );
      } else {
        try {
          setIsFetching(true);
          const newCategory = await createCategory({ name });
          setCategories([
            ...categories,
            { id: newCategory.id, name, subcategories: [] },
          ]);
          setIsFetching(false);
          Swal.fire("Success!", "Tạo danh mục thành công!", "success");
        } catch (error) {
          setIsFetching(false);
          Swal.fire("Oops!", "Tạo danh mục thất bại!", "error");
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
                      ...cat.subcategories,
                      { id: newSubcategory.id, name, attributes: [] },
                    ],
                  }
                : cat
            )
          );
          setIsFetching(false);
          Swal.fire("Success!", "Tạo danh mục con thành công!", "success");
        } catch (error) {
          setIsFetching(false);
          Swal.fire("Error!", "Tạo danh mục con thất bại!", "error");
        }
      }
    } else if (type === "attribute") {
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
      } else {
        try {
          setIsFetching(true);
          
          // Associate attribute with subcategory
         await createSubcategoryAttribute({
                subcategory_id: subcategoryId,
                attribute_id: attributeId,
              })
          // Update state with selected attribute
          const selectedAttribute = attributes.find(
            (attr) => attr.id === attributeId
          );
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
                              ...sub.attributes,
                              { id: selectedAttribute.id, name: selectedAttribute.name },
                            ],
                          }
                        : sub
                    ),
                  }
                : cat
            )
          );
          setIsFetching(false);
          Swal.fire("Success!", "Thêm thuộc tính thành công!", "success");
        } catch (error) {
          setIsFetching(false);
          Swal.fire("Error!", "Thêm thuộc tính thất bại!", "error");
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
      attributeId: null,
    });
  };

  // Handle cancel for add/edit
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
        attributeId: null,
      });
    }
  };

  // Handle delete actions
  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    if (expandedCategoryId === id) {
      setExpandedCategoryId(null);
    }
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
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#36d7b7" loading={true} size={50} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "categories"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            Quản lí danh mục
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "createAttribute"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("createAttribute")}
          >
            Quản lí thuộc tính
          </button>
        </div>
      </div>

      {/* Category Management Tab */}
      {activeTab === "categories" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-700">
              Quản lí danh mục
            </h3>
            {addState.type !== "category" ? (
              <button
                onClick={() => startAdd("category")}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} /> Thêm danh mục
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={addState.name}
                  onChange={(e) => handleInputChange(e, false)}
                  placeholder="Nhập tên danh mục"
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-48"
                />
                <button
                  onClick={(e) => handleSubmit(e, false)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
                  disabled={!addState.name}
                >
                  <Check size={16} /> Thêm
                </button>
                <button
                  onClick={() => handleCancel(false)}
                  className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-sm flex items-center gap-1"
                >
                  <X size={16} /> Hủy
                </button>
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={category.id} className="px-6 py-4">
                  <div
                    className="flex justify-between items-center mb-2 cursor-pointer"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {category.name}
                      </span>
                      {expandedCategoryId === category.id ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                    {editState.type !== "category" ||
                    editState.id !== category.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit("category", category);
                          }}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center gap-1"
                        >
                          <Edit size={16} /> Chỉnh sửa
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm flex items-center gap-1"
                        >
                          <Trash size={16} /> Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startAdd("subcategory", category.id);
                          }}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm flex items-center gap-1"
                        >
                          <Plus size={16} /> Thêm danh mục con
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editState.name}
                          onChange={(e) => handleInputChange(e, true)}
                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-48"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubmit(e, true);
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
                          disabled={!editState.name}
                        >
                          <Check size={16} /> Cập nhật
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(true);
                          }}
                          className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-sm flex items-center gap-1"
                        >
                          <X size={16} /> Hủy
                        </button>
                      </div>
                    )}
                  </div>
                  {addState.type === "subcategory" &&
                    addState.categoryId === category.id && (
                      <div className="ml-6 mb-2 flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                        <input
                          type="text"
                          value={addState.name}
                          onChange={(e) => handleInputChange(e, false)}
                          placeholder="Enter subcategory name"
                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-48"
                        />
                        <button
                          onClick={(e) => handleSubmit(e, false)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
                          disabled={!addState.name}
                        >
                          <Check size={16} /> Thêm
                        </button>
                        <button
                          onClick={() => handleCancel(false)}
                          className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-sm flex items-center gap-1"
                        >
                          <X size={16} /> Hủy
                        </button>
                      </div>
                    )}
                  {expandedCategoryId === category.id &&
                    category.subcategories.length > 0 && (
                      <ul className="ml-6 divide-y divide-gray-100">
                        {category.subcategories.map((subcategory) => (
                          <li
                            key={subcategory.id}
                            className="py-2 bg-gray-50 rounded-md my-1 px-2"
                          >
                            <div className="flex justify-between items-center">
                              {editState.type === "subcategory" &&
                              editState.id === subcategory.id &&
                              editState.categoryId === category.id ? (
                                <div className="flex items-center gap-2 w-full">
                                  <input
                                    type="text"
                                    value={editState.name}
                                    onChange={(e) => handleInputChange(e, true)}
                                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-48"
                                  />
                                  <button
                                    onClick={(e) => handleSubmit(e, true)}
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
                                    disabled={!editState.name}
                                  >
                                    <Check size={16} /> Cập nhật
                                  </button>
                                  <button
                                    onClick={() => handleCancel(true)}
                                    className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-sm flex items-center gap-1"
                                  >
                                    <X size={16} /> Hủy
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="text-sm text-gray-700 border-l-2 border-gray-400 pl-3">
                                    {subcategory.name}
                                  </span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        startEdit(
                                          "subcategory",
                                          subcategory,
                                          category.id
                                        )
                                      }
                                      className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center gap-1"
                                    >
                                      <Edit size={16} /> Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteSubcategory(
                                          category.id,
                                          subcategory.id
                                        )
                                      }
                                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm flex items-center gap-1"
                                    >
                                      <Trash size={16} /> Delete
                                    </button>
                                    <button
                                      onClick={() =>
                                        startAdd(
                                          "attribute",
                                          category.id,
                                          subcategory.id
                                        )
                                      }
                                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm flex items-center gap-1"
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
                                <div className="ml-8 mt-1.5 flex items-center gap-2 bg-gray-100 p-2 rounded-md">
                                  <select
                                    name="attributeId"
                                    value={addState.attributeId || ""}
                                    onChange={(e) => handleInputChange(e, false)}
                                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-48"
                                  >
                                    <option value="" disabled>
                                      Select attribute
                                    </option>
                                    {attributes.map((attr) => (
                                      <option key={attr.id} value={attr.id}>
                                        {attr.name}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={(e) => handleSubmit(e, false)}
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
                                    disabled={!addState.attributeId}
                                  >
                                    <Check size={16} /> Add
                                  </button>
                                  <button
                                    onClick={() => handleCancel(false)}
                                    className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-sm flex items-center gap-1"
                                  >
                                    <X size={16} /> Cancel
                                  </button>
                                </div>
                              )}
                            {subcategory.attributes.length > 0 && (
                              <ul className="ml-8 mt-1.5">
                                {subcategory.attributes.map((attribute) => (
                                  <li
                                    key={attribute.id}
                                    className="flex justify-between items-center text-sm text-gray-600 bg-gray-100 rounded-md my-1 px-2 py-1"
                                  >
                                    {editState.type === "attribute" &&
                                    editState.id === attribute.id &&
                                    editState.categoryId === category.id &&
                                    editState.subcategoryId ===
                                      subcategory.id ? (
                                      <div className="flex items-center gap-2 w-full">
                                        <input
                                          type="text"
                                          value={editState.name}
                                          onChange={(e) =>
                                            handleInputChange(e, true)
                                          }
                                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-48"
                                        />
                                        <button
                                          onClick={(e) => handleSubmit(e, true)}
                                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
                                          disabled={!editState.name}
                                        >
                                          <Check size={16} /> Update
                                        </button>
                                        <button
                                          onClick={() => handleCancel(true)}
                                          className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-sm flex items-center gap-1"
                                        >
                                          <X size={16} /> Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <span className="border-l-2 border-gray-400 pl-3">
                                          {attribute.name}
                                        </span>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() =>
                                              startEdit(
                                                "attribute",
                                                attribute,
                                                category.id,
                                                subcategory.id
                                              )
                                            }
                                            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center gap-1"
                                          >
                                            <Edit size={16} /> Edit
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteAttribute(
                                                category.id,
                                                subcategory.id,
                                                attribute.id
                                              )
                                            }
                                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm flex items-center gap-1"
                                          >
                                            <Trash size={16} /> Delete
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
        <AttributeTab
          categories={categories}
          setCategories={setCategories}
        />
      )}
    </div>
  );
};

export default CategoryManagement;