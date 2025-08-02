import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash } from "lucide-react";
import { api, apiNotHasTheHeader } from "../../config/interceptor-config";
import { Toaster, toast } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import CollapsibleSection from "./CollapsibleSection";
import DraggableImage from "./DraggableImage";
import EcommerceSpinner from "../Share/EcommerceSpinner";
import { useLocation } from "react-router-dom";

const ProductCreationForm = () => {
  const location = useLocation();
  const [productId, setProductId] = useState(null);
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
    shopId: "1",
    discount: "",
    notes: "",
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [existingProductImages, setExistingProductImages] = useState([]);
  const [categoryType, setCategoryType] = useState("one-level");
  const [oneLevelCategoryGroup, setOneLevelCategoryGroup] = useState("");
  const [oneLevelCategories, setOneLevelCategories] = useState([
    { value: "", quantity: "", price: "", image: null },
  ]);
  const [twoLevelCategoryGroup, setTwoLevelCategoryGroup] = useState("");
  const [twoLevelSubCategoryGroup, setTwoLevelSubCategoryGroup] = useState("");
  const [twoLevelCategories, setTwoLevelCategories] = useState([
    {
      parent_product_category: "",
      image: null,
      child_product_categories: [{ name: "", quantity: "", price: "" }],
    },
  ]);
  const [attributes, setAttributes] = useState([]);
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false);
  const [shippingTypes, setShippingTypes] = useState([]);
  const [isLoadingShippingTypes, setIsLoadingShippingTypes] = useState(false);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [dimensions, setDimensions] = useState({
    weight: 10,
    height: 20,
    width: 12,
    length: 30,
  });
  const [errors, setErrors] = useState({});
  const [openSections, setOpenSections] = useState({
    basicInfo: true,
    categories: false,
    attributes: false,
    dimensions: false,
    shipping: false,
  });
  const [isCreating, setIsCreating] = useState(false);

  // Extract productId from URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("productId");
    setProductId(id);
  }, [location.search]);

  // Fetch product details if productId exists
  useEffect(() => {
    if (productId) {
      const fetchProductDetails = async () => {
        try {
          const response = await api.get(
            `http://localhost:8080/api/v1/product/get_product_detail/${productId}`
          );
          const product = response.data;

          // Populate basic info
          const categoryId =
            product.product_basic_info?.sub_category_response?.category_response?.id?.toString() ||
            "";
          setBasicInfo((prev) => ({
            ...prev,
            name: product.product_basic_info?.name || "",
            description: product.product_basic_info?.description || "",
            categoryId,
            subCategoryId: "", // Set later after fetching subcategories
            shopId: product.shop_response?.id?.toString() || "1",
            discount: product.product_basic_info?.discount || "",
            notes: product.product_basic_info?.notes || "",
          }));

          // Fetch subcategories to match sub_category_response.name
          if (
            categoryId &&
            product.product_basic_info?.sub_category_response?.name
          ) {
            try {
              const subResponse = await api.get(
                `http://localhost:8080/api/v1/sub_category/${categoryId}`
              );
              const subCategoriesData = subResponse.data;
              setSubCategories(subCategoriesData);
              const matchedSubCategory = subCategoriesData.find(
                (sub) =>
                  sub.name ===
                  product.product_basic_info.sub_category_response.name
              );
              if (matchedSubCategory) {
                setBasicInfo((prev) => ({
                  ...prev,
                  subCategoryId: matchedSubCategory.id.toString(),
                }));
              } else {
                toast.error("Không tìm thấy danh mục con phù hợp.");
              }
            } catch (err) {
              toast.error("Không thể tải danh mục con để khớp tên.");
            }
          }

          // Set thumbnail and product images
          setExistingThumbnailUrl(
            product.product_basic_info?.thumbnail?.avatar_url || null
          );
          setExistingProductImages(product.product_images || []);

          // Set category type and categories
          if (
            product.product_category_responses
              ?.product_category_one_level_responses?.length
          ) {
            setCategoryType("one-level");
            setOneLevelCategoryGroup(
              product.product_category_responses?.product_category_group
                ?.product_category_group_name ||
                product.product_category_responses
                  ?.product_category_one_level_responses[0]?.name ||
                "Màu"
            );
            setOneLevelCategories(
              product.product_category_responses.product_category_one_level_responses.map(
                (cat) => ({
                  value: cat.value || "",
                  quantity: cat.quantity?.toString() || "",
                  price: cat.price?.toString() || "",
                  image: null,
                  imageUrl: cat.image_url || null,
                })
              ) || [{ value: "", quantity: "", price: "", image: null }]
            );
          } else if (
            product.product_category_responses?.product_category_two_level
              ?.length
          ) {
            setCategoryType("two-level");
            setTwoLevelCategoryGroup(
              product.product_category_responses?.product_category_group
                ?.product_category_group_name || ""
            );
            setTwoLevelSubCategoryGroup(
              product.product_category_responses?.sub_product_category_group
                ?.product_category_group_name || ""
            );
            setTwoLevelCategories(
              product.product_category_responses.product_category_two_level.map(
                (cat) => ({
                  parent_product_category:
                    cat.product_category_response?.name || "",
                  image: null,
                  imageUrl: cat.product_category_response?.image_url || null,
                  child_product_categories:
                    cat.child_product_category_responses.map((child) => ({
                      name: child.name || "",
                      quantity: child.quantity?.toString() || "",
                      price: child.price?.toString() || "",
                    })) || [{ name: "", quantity: "", price: "" }],
                })
              ) || [
                {
                  parent_product_category: "",
                  image: null,
                  child_product_categories: [
                    { name: "", quantity: "", price: "" },
                  ],
                },
              ]
            );
          }

          // Set attributes
          setAttributes(
            product.product_attribute_value_responses?.map((attr) => ({
              attributeId: attr.product_attribute_value_id,
              value: attr.value || "",
              name: attr.attribute_name || "",
            })) || []
          );

          // Set dimensions (fallback to defaults if not provided)
          setDimensions({
            weight: product.weight || 10,
            height: product.height || 20,
            width: product.width || 12,
            length: product.length || 30,
          });

          // Set shipping types
          setShippingTypes(
            product.product_shipping_type_responses?.map((type) => ({
              id: type.shippingType.id,
              type: type.shippingType.name,
              enabled: true,
              cost: type.shippingType.price || null,
              eta: `${type.shippingType.estimatedTime} ngày` || "",
              description: type.shippingType.description || "",
            })) || []
          );
        } catch (err) {
          toast.error("Không thể tải thông tin sản phẩm.");
        }
      };
      fetchProductDetails();
    }
  }, [productId]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(
          "http://localhost:8080/api/v1/category/get_all_categories"
        );
        setCategories(response.data);
      } catch (err) {
        toast.error("Không thể tải danh mục sản phẩm.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories
  useEffect(() => {
    if (basicInfo.categoryId) {
      const fetchSubCategories = async () => {
        try {
          const response = await api.get(
            `http://localhost:8080/api/v1/sub_category/${basicInfo.categoryId}`
          );
          setSubCategories(response.data);
          if (!productId) {
            setBasicInfo((prev) => ({ ...prev, subCategoryId: "" }));
          }
        } catch (err) {
          toast.error("Không thể tải danh mục con.");
          setSubCategories([]);
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]);
      setBasicInfo((prev) => ({ ...prev, subCategoryId: "" }));
      setAvailableAttributes([]);
      setAttributes([]);
    }
  }, [basicInfo.categoryId, productId]);

  // Fetch attributes
  useEffect(() => {
    if (basicInfo.subCategoryId) {
      const fetchAttributes = async () => {
        setIsLoadingAttributes(true);
        try {
          const response = await api.get(
            `http://localhost:8080/api/v1/subcategory_attribute/${basicInfo.subCategoryId}`
          );
          const attributesData = response.data;
          const subAttributes = attributesData.sub_attribute || [];
          setAvailableAttributes(subAttributes);
          if (!productId) {
            setAttributes(
              subAttributes.map((attr) => ({
                attributeId: attr.attribute_id,
                value: "",
                name: attr.attribute_value,
              }))
            );
          }
        } catch (err) {
          toast.error("Không thể tải thuộc tính sản phẩm.");
          setAvailableAttributes([]);
          setAttributes([]);
        } finally {
          setIsLoadingAttributes(false);
        }
      };
      fetchAttributes();
    } else {
      setAvailableAttributes([]);
      setAttributes([]);
    }
  }, [basicInfo.subCategoryId, productId]);

  // Fetch shipping types
  useEffect(() => {
    const fetchShippingTypes = async () => {
      setIsLoadingShippingTypes(true);
      try {
        const response = await api.get("/shipping_type");
        const shippingData = response.data;
        setShippingTypes((prev) => {
          const newShippingTypes = shippingData.map((type) => ({
            type: type.name,
            enabled: prev.find((p) => p.id === type.id)?.enabled || false,
            cost: null,
            eta: `${type.estimated_time} ngày`,
            id: type.id,
            description: type.description,
          }));
          return newShippingTypes;
        });
      } catch (err) {
        toast.error("Không thể tải danh sách phương thức vận chuyển.");
        setShippingTypes([]);
      } finally {
        setIsLoadingShippingTypes(false);
      }
    };
    fetchShippingTypes();
  }, []);

  // Debounced shipping fee calculation
  const calculateShippingFees = useCallback(
    debounce(async () => {
      try {
        if (
          dimensions.weight > 0 &&
          dimensions.height > 0 &&
          dimensions.width > 0 &&
          dimensions.length > 0
        ) {
          setIsLoadingShipping(true);
          const response = await api.post(
            "http://localhost:8080/api/v1/product_shipping/calculate_each_shipping_type_fee",
            {
              weight: dimensions.weight,
              height: dimensions.height,
              width: dimensions.width,
              length: dimensions.length,
            }
          );
          const shippingFees = response.data;
          setShippingTypes((prev) =>
            prev.map((type) => {
              const feeData = shippingFees.find(
                (fee) => fee.shipping_type_response.name === type.type
              );
              return {
                ...type,
                cost: feeData ? feeData.price : null,
              };
            })
          );
        }
      } catch (err) {
        toast.error("Không thể tính phí vận chuyển.");
      } finally {
        setIsLoadingShipping(false);
      }
    }, 500),
    [dimensions.weight, dimensions.height, dimensions.width, dimensions.length]
  );

  useEffect(() => {
    calculateShippingFees();
    return () => calculateShippingFees.cancel();
  }, [calculateShippingFees]);

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e, setFile, isMultiple = false) => {
    const files = isMultiple ? Array.from(e.target.files) : [e.target.files[0]];
    if (files.every((file) => file && file.type.startsWith("image/"))) {
      setFile(isMultiple ? files : files[0]);
      setErrors((prev) => ({
        ...prev,
        [isMultiple ? "productImages" : "thumbnail"]: "",
      }));
    } else {
      toast.error("Vui lòng tải lên hình ảnh định dạng JPEG hoặc PNG.");
      e.target.value = null;
    }
  };

  const removeProductImage = (index) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...productImages];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setProductImages(updatedImages);
  };

  const handleOneLevelCategoryChange = (index, field, value) => {
    const updated = [...oneLevelCategories];
    updated[index][field] = value;
    setOneLevelCategories(updated);
    setErrors((prev) => ({ ...prev, oneLevelCategories: "" }));
  };

  const handleOneLevelImageChange = (index, file) => {
    const updated = [...oneLevelCategories];
    updated[index].image = file;
    setOneLevelCategories(updated);
    setErrors((prev) => ({ ...prev, oneLevelCategories: "" }));
  };

  const addOneLevelCategory = () => {
    setOneLevelCategories([
      ...oneLevelCategories,
      { value: "", quantity: "", price: "", image: null },
    ]);
  };

  const removeOneLevelCategory = (index) => {
    setOneLevelCategories(oneLevelCategories.filter((_, i) => i !== index));
  };

  const handleTwoLevelParentChange = (index, field, value) => {
    const updated = [...twoLevelCategories];
    updated[index][field] = value;
    setTwoLevelCategories(updated);
    setErrors((prev) => ({ ...prev, twoLevelCategories: "" }));
  };

  const handleTwoLevelImageChange = (index, file) => {
    const updated = [...twoLevelCategories];
    updated[index].image = file;
    setTwoLevelCategories(updated);
    setErrors((prev) => ({ ...prev, twoLevelCategories: "" }));
  };

  const handleTwoLevelChildChange = (catIndex, childIndex, field, value) => {
    const updated = [...twoLevelCategories];
    updated[catIndex].child_product_categories[childIndex][field] = value;
    setTwoLevelCategories(updated);
    setErrors((prev) => ({ ...prev, twoLevelCategories: "" }));
  };

  const addTwoLevelChild = (catIndex) => {
    const updated = [...twoLevelCategories];
    updated[catIndex].child_product_categories.push({
      name: "",
      quantity: "",
      price: "",
    });
    setTwoLevelCategories(updated);
  };

  const removeTwoLevelChild = (catIndex, childIndex) => {
    const updated = [...twoLevelCategories];
    updated[catIndex].child_product_categories = updated[
      catIndex
    ].child_product_categories.filter((_, i) => i !== childIndex);
    setTwoLevelCategories(updated);
  };

  const addTwoLevelCategory = () => {
    setTwoLevelCategories([
      ...twoLevelCategories,
      {
        parent_product_category: "",
        image: null,
        child_product_categories: [{ name: "", quantity: "", price: "" }],
      },
    ]);
  };

  const removeTwoLevelCategory = (index) => {
    setTwoLevelCategories(twoLevelCategories.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index, value) => {
    const updated = [...attributes];
    updated[index].value = value;
    setAttributes(updated);
    setErrors((prev) => ({ ...prev, attributes: "" }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);
    setDimensions((prev) => ({
      ...prev,
      [name]: isNaN(parsedValue) ? "" : parsedValue,
    }));
    setErrors((prev) => ({ ...prev, dimensions: "" }));
  };

  const handleShippingTypeChange = (index) => {
    const updated = [...shippingTypes];
    updated[index].enabled = !updated[index].enabled;
    setShippingTypes(updated);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!basicInfo.name) newErrors.name = "Vui lòng nhập tên sản phẩm.";
    if (!basicInfo.description)
      newErrors.description = "Vui lòng nhập mô tả sản phẩm.";
    if (!basicInfo.categoryId) newErrors.categoryId = "Vui lòng chọn danh mục.";
    if (!basicInfo.subCategoryId)
      newErrors.subCategoryId = "Vui lòng chọn danh mục con.";
    if (
      basicInfo.discount &&
      (basicInfo.discount < 0 || basicInfo.discount > 100)
    )
      newErrors.discount = "Khuyến mãi phải từ 0 đến 100%.";
    if (!thumbnail && !existingThumbnailUrl)
      newErrors.thumbnail = "Vui lòng tải hình ảnh đại diện.";
    if (productImages.length === 0 && existingProductImages.length === 0)
      newErrors.productImages = "Vui lòng tải ít nhất một hình ảnh sản phẩm.";
    if (categoryType === "one-level") {
      if (!oneLevelCategoryGroup)
        newErrors.oneLevelCategoryGroup = "Vui lòng nhập tên nhóm danh mục.";
      if (
        oneLevelCategories.some(
          (cat) =>
            (!cat.image && !cat.imageUrl) ||
            !cat.value ||
            !cat.quantity ||
            !cat.price
        )
      ) {
        newErrors.oneLevelCategories =
          "Vui lòng nhập đầy đủ thông tin cho danh mục cấp một.";
      }
    } else {
      if (!twoLevelCategoryGroup || !twoLevelSubCategoryGroup) {
        newErrors.twoLevelCategoryGroup =
          "Vui lòng nhập tên nhóm danh mục cha và con.";
      }
      if (
        twoLevelCategories.some(
          (cat) =>
            (!cat.image && !cat.imageUrl) ||
            !cat.parent_product_category ||
            cat.child_product_categories.some(
              (child) => !child.name || !child.quantity || !child.price
            )
        )
      ) {
        newErrors.twoLevelCategories =
          "Vui lòng nhập đầy đủ thông tin cho danh mục phân loại.";
      }
    }
    if (attributes.length > 0 && attributes.some((attr) => !attr.value)) {
      newErrors.attributes = "Vui lòng nhập giá trị cho tất cả thuộc tính.";
    }
    if (
      dimensions.weight <= 0 ||
      dimensions.height <= 0 ||
      dimensions.width <= 0 ||
      dimensions.length <= 0
    ) {
      newErrors.dimensions = "Kích thước phải lớn hơn 0.";
    }

    const selectedShippingTypeIds = shippingTypes
      .filter((type) => type.enabled)
      .map((type) => type.id);

    if (selectedShippingTypeIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một phương thức vận chuyển.");
      return false;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra và điền đầy đủ thông tin.");
      return;
    }

    setIsCreating(true);
    try {
      const productFormData = new FormData();

      // Basic info
      productFormData.append("id", productId || null);
      productFormData.append("name", basicInfo.name);
      productFormData.append("description", basicInfo.description);
      productFormData.append("subcategoryId", basicInfo.subCategoryId);
      if (basicInfo.discount)
        productFormData.append("discount", basicInfo.discount);
      if (basicInfo.notes) productFormData.append("notes", basicInfo.notes);
      productFormData.append("shopId", basicInfo.shopId);

      // Thumbnail and product images (only append if new files are selected)
      if (thumbnail) {
        productFormData.append("thumbnail", thumbnail);
      }
      productImages.forEach((image, index) => {
        if (image instanceof File) {
          productFormData.append(`productImages[${index}]`, image);
        }
      });


      // Create product
      const createResponse = await api.post(
        "http://localhost:8080/api/v1/product/create_product",
        productFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      let productIdResponse = createResponse.data;

      // Handle categories
      if (categoryType === "one-level") {
        const fd = new FormData();
        fd.append(
          "productCategoryRequest",
          new Blob(
            [
              JSON.stringify({
                product_category_group_name: oneLevelCategoryGroup,
                product_categories: oneLevelCategories.map((c) => ({
                  value: c.value,
                  quantity: c.quantity,
                  price: c.price,
                })),
              }),
            ],
            { type: "application/json" }
          )
        );
        oneLevelCategories.forEach((cat) => {
          if (cat.image instanceof File) {
            fd.append("files", cat.image, cat.image.name);
          }
        });
        await apiNotHasTheHeader.post(
          `/product_category/add_multiple/one_level?productId=${productIdResponse}`,
          fd
        );
      } else {
        const fd = new FormData();
        fd.append(
          "multipleProductCategoryDTO",
          new Blob(
            [
              JSON.stringify({
                product_category_group: twoLevelCategoryGroup,
                sub_product_category_group: twoLevelSubCategoryGroup,
                product_category_two_level: twoLevelCategories.map((cat) => ({
                  parent_product_category: cat.parent_product_category,
                  child_product_categories: cat.child_product_categories.map(
                    (child) => ({
                      name: child.name,
                      quantity: parseInt(child.quantity, 10),
                      price: parseInt(child.price, 10),
                    })
                  ),
                })),
              }),
            ],
            { type: "application/json" }
          )
        );
        twoLevelCategories.forEach((cat) => {
          if (cat.image instanceof File) {
            fd.append("files", cat.image, cat.image.name);
          }
        });
        await apiNotHasTheHeader.post(
          `/product_category/add_multiple/two_level?productId=${productIdResponse}`,
          fd
        );
      }

      // Handle attributes
      if (attributes.length > 0) {
        const payload = attributes.map((attr) => ({
          subcategory_attribute_id: attr.attributeId,
          value: attr.value.trim(),
        }));
        await api.post(
          `/product_attribute_value/add_multiple?productId=${productIdResponse}`,
          payload
        );
      }

      // Handle shipping types
      const selectedShippingTypeIds = shippingTypes
        .filter((type) => type.enabled)
        .map((type) => type.id);
      await api.post("/product_shipping/create_product_shipping_type", {
        product_id: productIdResponse,
        weight: dimensions.weight,
        height: dimensions.height,
        width: dimensions.width,
        length: dimensions.length,
        shipping_type_ids: selectedShippingTypeIds,
      });

      Swal.fire({
        icon: "success",
        title: productId ? "Cập nhật thành công!" : "Thành công!",
        text: productId
          ? "Sản phẩm đã được cập nhật thành công!"
          : "Sản phẩm đã được tạo thành công!",
        confirmButtonText: "OK",
      });

      setIsCreating(false);
      if (!productId) {
        reloadTheInputAfterCreatingProduct();
      }
    } catch (err) {
      setIsCreating(false);
      Swal.fire({
        icon: "error",
        title: "Thất bại!",
        text: err.response?.data?.message || "Không thể xử lý sản phẩm.",
        confirmButtonText: "OK",
      });
    }
  };

  function reloadTheInputAfterCreatingProduct() {
    setBasicInfo({
      name: "",
      description: "",
      categoryId: "",
      subCategoryId: "",
      shopId: "1",
      discount: "",
      notes: "",
    });
    setThumbnail(null);
    setExistingThumbnailUrl(null);
    setProductImages([]);
    setExistingProductImages([]);
    setOneLevelCategoryGroup("");
    setOneLevelCategories([
      { value: "", quantity: "", price: "", image: null },
    ]);
    setTwoLevelCategoryGroup("");
    setTwoLevelSubCategoryGroup("");
    setTwoLevelCategories([
      {
        parent_product_category: "",
        image: null,
        child_product_categories: [{ name: "", quantity: "", price: "" }],
      },
    ]);
    setAttributes([]);
    setAvailableAttributes([]);
    setShippingTypes([]);
    setDimensions({ weight: 10, height: 20, width: 12, length: 30 });
    setErrors({});
    setCategoryType("one-level");
  }

  // Toggle collapsible sections
  const toggleSection = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  return (
    <>
      {isCreating && (
        <EcommerceSpinner
          text={
            productId ? "Đang cập nhật sản phẩm ..." : "Đang tạo sản phẩm ..."
          }
        />
      )}
      <DndProvider backend={HTML5Backend}>
        <div className="mx-auto p-5 bg-white min-h-screen font-inter text-base sm:text-lg">
          <Toaster position="top-right" />
          <div className="bg-white rounded-md shadow-md border border-gray-200 p-5 sm:p-6">
            <h2 className="text-3xl font-semibold text-teal-600 mb-6">
              {productId ? "Chỉnh Sửa Sản Phẩm" : "Tạo Sản Phẩm Mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Info */}
              <CollapsibleSection
                title="Thông Tin Cơ Bản"
                isOpen={openSections.basicInfo}
                toggle={() => toggleSection("basicInfo")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-1">
                      Tên Sản Phẩm <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={basicInfo.name}
                      onChange={handleBasicInfoChange}
                      placeholder="VD: Áo dài truyền thống"
                      className={`w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500 ${
                        errors.name ? "border-red-600" : "border-gray-200"
                      }`}
                      aria-label="Tên sản phẩm"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-1">
                      Danh Mục <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="categoryId"
                      value={basicInfo.categoryId}
                      onChange={handleBasicInfoChange}
                      className={`w-full px-4 py-2 border rounded-md bg-white text-gray-800 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500 ${
                        errors.categoryId ? "border-red-600" : "border-gray-200"
                      }`}
                      aria-label="Danh mục"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.categoryId}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-1">
                      Danh Mục Con <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="subCategoryId"
                      value={basicInfo.subCategoryId}
                      onChange={handleBasicInfoChange}
                      className={`w-full px-4 py-2 border rounded-md bg-white text-gray-800 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500 ${
                        errors.subCategoryId
                          ? "border-red-600"
                          : "border-gray-200"
                      }`}
                      disabled={!basicInfo.categoryId}
                      aria-label="Danh mục con"
                    >
                      <option value="">Chọn danh mục con</option>
                      {subCategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                    {errors.subCategoryId && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.subCategoryId}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-1">
                      Khuyến Mãi (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={basicInfo.discount}
                      onChange={handleBasicInfoChange}
                      placeholder="VD: 10"
                      className={`w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500 ${
                        errors.discount ? "border-red-600" : "border-gray-200"
                      }`}
                      min="0"
                      max="100"
                      aria-label="Khuyến mãi"
                    />
                    {errors.discount && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.discount}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-base font-medium text-gray-800 mb-1">
                    Mô Tả Sản Phẩm <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={basicInfo.description}
                    onChange={handleBasicInfoChange}
                    placeholder="Mô tả chi tiết sản phẩm, ví dụ: Áo dài may từ vải lụa mềm mại, phù hợp cho các dịp lễ..."
                    className={`w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500 ${
                      errors.description ? "border-red-600" : "border-gray-200"
                    }`}
                    rows="5"
                    aria-label="Mô tả sản phẩm"
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-1">
                      Hình Ảnh Đại Diện <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setThumbnail)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-md bg-white text-gray-800 text-base file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 transition-colors duration-150"
                      aria-label="Hình ảnh đại diện"
                    />
                    {(thumbnail || existingThumbnailUrl) && (
                      <div className="mt-4 flex items-center space-x-4">
                        <img
                          src={
                            thumbnail
                              ? URL.createObjectURL(thumbnail)
                              : existingThumbnailUrl
                          }
                          alt="Xem trước hình ảnh đại diện"
                          className="w-24 h-24 object-cover rounded-md border border-gray-200"
                        />
                        <p className="text-base text-gray-600 truncate">
                          {thumbnail ? thumbnail.name : "Hình ảnh hiện tại"}
                        </p>
                      </div>
                    )}
                    {errors.thumbnail && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.thumbnail}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-1">
                      Hình Ảnh Sản Phẩm <span className="text-red-600">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-200 rounded-md p-4 text-center bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          handleFileChange(e, setProductImages, true)
                        }
                        className="hidden"
                        id="productImages"
                      />
                      <label
                        htmlFor="productImages"
                        className="cursor-pointer text-gray-800 hover:text-teal-600 transition-colors duration-150 text-base"
                      >
                        Kéo thả hoặc nhấp để tải ảnh sản phẩm
                      </label>
                    </div>
                    {(productImages.length > 0 ||
                      existingProductImages.length > 0) && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {existingProductImages.map((image, index) => (
                          <div key={`existing-${index}`} className="relative">
                            <img
                              src={image.avatar_url}
                              alt={`Hình ảnh sản phẩm ${index}`}
                              className="w-24 h-24 object-cover rounded-md border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setExistingProductImages(
                                  existingProductImages.filter(
                                    (_, i) => i !== index
                                  )
                                )
                              }
                              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        ))}
                        {productImages.map((image, index) => (
                          <DraggableImage
                            key={index}
                            image={image}
                            index={index}
                            moveImage={moveImage}
                            removeImage={removeProductImage}
                          />
                        ))}
                      </div>
                    )}
                    {errors.productImages && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.productImages}
                      </p>
                    )}
                  </div>
                </div>
              </CollapsibleSection>

              {/* Categories */}
              <CollapsibleSection
                title="Phân Loại Sản Phẩm"
                isOpen={openSections.categories}
                toggle={() => toggleSection("categories")}
              >
                <div>
                  <label className="block text-base font-medium text-gray-800 mb-1">
                    Loại Phân Loại
                  </label>
                  <select
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    className="w-full sm:w-1/2 px-4 py-2 border border-gray-200 rounded-md bg-white text-gray-800 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500"
                    aria-label="Loại phân loại"
                  >
                    <option value="one-level">Cấp Một (VD: Chất liệu)</option>
                    <option value="two-level">
                      Cấp Hai (VD: Chất liệu & Kích cỡ)
                    </option>
                  </select>
                </div>

                {categoryType === "one-level" ? (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-base font-medium text-gray-800 mb-1">
                        Tên Nhóm Phân Loại{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={oneLevelCategoryGroup}
                        onChange={(e) =>
                          setOneLevelCategoryGroup(e.target.value)
                        }
                        placeholder="VD: Chất liệu"
                        className={`w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500 ${
                          errors.oneLevelCategoryGroup
                            ? "border-red-600"
                            : "border-gray-200"
                        }`}
                        aria-label="Tên nhóm phân loại"
                      />
                      {errors.oneLevelCategoryGroup && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.oneLevelCategoryGroup}
                        </p>
                      )}
                    </div>
                    {oneLevelCategories.map((cat, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-md border border-gray-200 shadow-sm"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-base font-medium text-gray-800 mb-1">
                              Giá Trị <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              value={cat.value}
                              onChange={(e) =>
                                handleOneLevelCategoryChange(
                                  index,
                                  "value",
                                  e.target.value
                                )
                              }
                              placeholder="VD: Vải lụa"
                              className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500 border-gray-300"
                            />
                          </div>
                          <div>
                            <label className="block text-base font-medium text-gray-800 mb-1">
                              Số Lượng <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="number"
                              value={cat.quantity}
                              onChange={(e) =>
                                handleOneLevelCategoryChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              placeholder="VD: 50"
                              className="border-gray-300 w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-base font-medium text-gray-800 mb-1">
                              Giá (VNĐ) <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="number"
                              value={cat.price}
                              onChange={(e) =>
                                handleOneLevelCategoryChange(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                              placeholder="VD: 500000"
                              step="0.01"
                              className="border-gray-300 w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-base font-medium text-gray-800 mb-1">
                              Hình Ảnh <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleOneLevelImageChange(
                                  index,
                                  e.target.files[0]
                                )
                              }
                              className="w-full px-4 py-2 border border-gray-200 rounded-md bg-white text-gray-800 text-base file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 transition-colors duration-150"
                            />
                            {(cat.image || cat.imageUrl) && (
                              <div className="mt-4 flex items-center space-x-4">
                                <img
                                  src={
                                    cat.image
                                      ? URL.createObjectURL(cat.image)
                                      : cat.imageUrl
                                  }
                                  alt="Xem trước hình ảnh phân loại"
                                  className="w-24 h-24 object-cover rounded-md border border-gray-200"
                                />
                                <p className="text-base text-gray-600 truncate">
                                  {cat.image
                                    ? cat.image.name
                                    : "Hình ảnh hiện tại"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        {oneLevelCategories.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOneLevelCategory(index)}
                            className="mt-4 text-gray-800 hover:text-teal-600 flex items-center text-base font-medium transition-colors duration-150"
                          >
                            <Trash size={20} className="mr-2 text-teal-600" />
                            Xóa Phân Loại
                          </button>
                        )}
                      </div>
                    ))}
                    {errors.oneLevelCategories && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.oneLevelCategories}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={addOneLevelCategory}
                      className="text-gray-800 hover:text-teal-600 flex items-center text-base font-medium transition-colors duration-150"
                    >
                      <Plus size={20} className="mr-2 text-teal-600" />
                      Thêm Phân Loại
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-medium text-gray-800 mb-1">
                          Nhóm Phân Loại Cha{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={twoLevelCategoryGroup}
                          onChange={(e) =>
                            setTwoLevelCategoryGroup(e.target.value)
                          }
                          placeholder="VD: Chất liệu"
                          className={`border-gray-300 w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500  ${
                            errors.twoLevelCategoryGroup
                              ? "border-red-600"
                              : "border-gray-200"
                          }`}
                          aria-label="Nhóm phân loại cha"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-800 mb-1">
                          Nhóm Phân Loại Con{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={twoLevelSubCategoryGroup}
                          onChange={(e) =>
                            setTwoLevelSubCategoryGroup(e.target.value)
                          }
                          placeholder="VD: Kích cỡ"
                          className={`w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500 ${
                            errors.twoLevelCategoryGroup
                              ? "border-red-600"
                              : "border-gray-200"
                          }`}
                          aria-label="Nhóm phân loại con"
                        />
                      </div>
                    </div>
                    {errors.twoLevelCategoryGroup && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.twoLevelCategoryGroup}
                      </p>
                    )}
                    {twoLevelCategories.map((cat, catIndex) => (
                      <div
                        key={catIndex}
                        className="bg-white p-4 rounded-md border border-gray-200 shadow-sm"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-base font-medium text-gray-800 mb-1">
                              Phân Loại Cha{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              value={cat.parent_product_category}
                              onChange={(e) =>
                                handleTwoLevelParentChange(
                                  catIndex,
                                  "parent_product_category",
                                  e.target.value
                                )
                              }
                              placeholder="VD: Vải lụa"
                              className="border-gray-300 w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-base font-medium text-gray-800 mb-1">
                              Hình Ảnh <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleTwoLevelImageChange(
                                  catIndex,
                                  e.target.files[0]
                                )
                              }
                              className="w-full px-4 py-2 border border-gray-200 rounded-md bg-white text-gray-800 text-base file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 transition-colors duration-150"
                            />
                            {(cat.image || cat.imageUrl) && (
                              <div className="mt-4 flex items-center space-x-4">
                                <img
                                  src={
                                    cat.image
                                      ? URL.createObjectURL(cat.image)
                                      : cat.imageUrl
                                  }
                                  alt="Xem trước hình ảnh phân loại"
                                  className="w-24 h-24 object-cover rounded-md border border-gray-200"
                                />
                                <p className="text-base text-gray-600 truncate">
                                  {cat.image
                                    ? cat.image.name
                                    : "Hình ảnh hiện tại"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-4">
                          {cat.child_product_categories.map(
                            (child, childIndex) => (
                              <div
                                key={childIndex}
                                className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-4 border-l-2 border-gray-200"
                              >
                                <div>
                                  <label className="block text-base font-medium text-gray-800 mb-1">
                                    Phân Loại Con{" "}
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={child.name}
                                    onChange={(e) =>
                                      handleTwoLevelChildChange(
                                        catIndex,
                                        childIndex,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="VD: S"
                                    className="border-gray-300 w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-base font-medium text-gray-800 mb-1">
                                    Số Lượng{" "}
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    value={child.quantity}
                                    onChange={(e) =>
                                      handleTwoLevelChildChange(
                                        catIndex,
                                        childIndex,
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                    placeholder="VD: 30"
                                    className="border-gray-300 w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-base font-medium text-gray-800 mb-1">
                                    Giá (VNĐ){" "}
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    value={child.price}
                                    onChange={(e) =>
                                      handleTwoLevelChildChange(
                                        catIndex,
                                        childIndex,
                                        "price",
                                        e.target.value
                                      )
                                    }
                                    placeholder="VD: 500000"
                                    step="0.01"
                                    className="border-gray-300 w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500"
                                  />
                                </div>
                                {cat.child_product_categories.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeTwoLevelChild(catIndex, childIndex)
                                    }
                                    className="mt-4 text-gray-800 hover:text-teal-600 flex items-center text-base font-medium transition-colors duration-150"
                                  >
                                    <Trash
                                      size={20}
                                      className="mr-2 text-teal-600"
                                    />
                                    Xóa Phân loại Con
                                  </button>
                                )}
                              </div>
                            )
                          )}
                          <button
                            type="button"
                            onClick={() => addTwoLevelChild(catIndex)}
                            className="text-gray-800 hover:text-teal-600 flex items-center text-base font-medium pl-4 transition-colors duration-150"
                          >
                            <Plus size={20} className="mr-2 text-teal-600" />
                            Thêm Phân Loại Con
                          </button>
                        </div>
                        {twoLevelCategories.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTwoLevelCategory(catIndex)}
                            className="mt-4 text-gray-800 hover:text-teal-600 flex items-center text-base font-medium transition-colors duration-150"
                          >
                            <Trash size={20} className="mr-2 text-teal-600" />
                            Xóa Phân Loại Cha
                          </button>
                        )}
                      </div>
                    ))}
                    {errors.twoLevelCategories && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.twoLevelCategories}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={addTwoLevelCategory}
                      className="text-gray-800 hover:text-teal-600 flex items-center text-base font-medium transition-colors-150 duration-150"
                    >
                      <Plus size={20} className="mr-2 text-teal-600" />
                      Thêm Phân Loại Cha
                    </button>
                  </div>
                )}
              </CollapsibleSection>

              {/* Attributes */}
              <CollapsibleSection
                title="Thuộc Tính Sản Phẩm"
                isOpen={openSections.attributes}
                toggle={() => toggleSection("attributes")}
              >
                {isLoadingAttributes ? (
                  <div className="flex items-center space-x-2 text-gray-600 bg-white border border-gray-200 p-4 rounded-md">
                    <svg
                      className="animate-spin h-5 w-5 text-teal-500"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-base">Đang tải thuộc tính...</span>
                  </div>
                ) : availableAttributes.length === 0 ? (
                  <p className="text-base text-gray-600 p-4 bg-white border border-gray-200 rounded-md">
                    {basicInfo.subCategoryId
                      ? "Không có thuộc tính nào cho danh mục con này."
                      : "Vui lòng chọn danh mục con để xem thuộc tính."}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {attributes.map((attr, index) => {
                      const attribute = availableAttributes.find(
                        (a) => a.attribute_id === attr.attributeId
                      );
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          <div>
                            <label className="block text-base font-medium text-gray-800 mb-1">
                              {attribute
                                ? attribute.attribute_value
                                : attr.name || "Thuộc Tính"}{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              value={attr.value}
                              onChange={(e) =>
                                handleAttributeChange(index, e.target.value)
                              }
                              placeholder={`Nhập giá trị, ví dụ: ${
                                attribute
                                  ? attribute.attribute_value
                                  : attr.name || "Xuất xứ Đà Nẵng"
                              }`}
                              className={`w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500 ${
                                errors.attributes
                                  ? "border-red-600"
                                  : "border-gray-200"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {errors.attributes && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.attributes}
                      </p>
                    )}
                  </div>
                )}
              </CollapsibleSection>

              {/* Dimensions */}
              <CollapsibleSection
                title="Kích Thước Gói Hàng"
                isOpen={openSections.dimensions}
                toggle={() => toggleSection("dimensions")}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-1">
                      Cân Nặng (kg) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={dimensions.weight}
                      onChange={handleDimensionChange}
                      placeholder="VD: 10"
                      className={`w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500 ${
                        errors.dimensions ? "border-red-600" : "border-gray-200"
                      }`}
                      step="0.01"
                      min="0"
                      aria-label="Cân nặng"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-1">
                      Chiều Cao (cm) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={dimensions.height}
                      onChange={handleDimensionChange}
                      placeholder="VD: 20"
                      className={`w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500 ${
                        errors.dimensions ? "border-red-600" : "border-gray-200"
                      }`}
                      step="0.01"
                      min="0"
                      aria-label="Chiều cao"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-1">
                      Chiều Rộng (cm) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="width"
                      value={dimensions.width}
                      onChange={handleDimensionChange}
                      placeholder="VD: 12"
                      className={`w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500 ${
                        errors.dimensions ? "border-red-600" : "border-gray-200"
                      }`}
                      step="0.01"
                      min="0"
                      aria-label="Chiều rộng"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-1">
                      Chiều Dài (cm) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="length"
                      value={dimensions.length}
                      onChange={handleDimensionChange}
                      placeholder="VD: 30"
                      className={`w-full px-4 py-2 border rounded-md bg-white text-gray-800 placeholder-gray-500 text-base leading-6 transition-all duration-150 focus:outline-none focus:border-teal-500 px-2 ${
                        errors.dimensions ? "border-red-600" : "border-gray-200"
                      }`}
                      step="0.01"
                      min="0"
                      aria-label="Chiều dài"
                    />
                  </div>
                </div>
                {errors.dimensions && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.dimensions}
                  </p>
                )}
              </CollapsibleSection>

              <CollapsibleSection
                title="Phương Thức Vận Chuyển"
                isOpen={openSections.shipping}
                toggle={() => toggleSection("shipping")}
              >
                <div className="space-y-4">
                  <p className="text-base text-gray-600">
                    Chọn phương thức vận chuyển phù hợp với sản phẩm của bạn.
                  </p>
                  {isLoadingShippingTypes ? (
                    <div className="flex items-center space-x-2 text-gray-600 bg-white border border-gray-200 p-4 rounded-md">
                      <svg
                        className="animate-spin h-5 w-5 text-teal-500"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="text-base">
                        Đang tải phương thức vận chuyển...
                      </span>
                    </div>
                  ) : shippingTypes.length === 0 ? (
                    <p className="text-base text-gray-600 p-4 bg-white border border-gray-200 rounded-md">
                      Không có phương thức vận chuyển nào được cấu hình.
                    </p>
                  ) : (
                    shippingTypes.map((type, index) => (
                      <div
                        key={type.id || index}
                        className="flex items-center space-x-3"
                      >
                        <input
                          type="checkbox"
                          checked={type.enabled}
                          onChange={() => handleShippingTypeChange(index)}
                          className="h-4 w-4 text-teal-500 focus:ring-blue-500 rounded"
                          aria-label={`Kích hoạt ${type.type}`}
                        />
                        <label className="text-base font-medium text-gray-800 flex items-center space-x-2">
                          <span>{type.type}</span>
                          <span className="text-teal-600">({type.eta})</span>
                          {isLoadingShipping ? (
                            <span className="text-gray-500 animate-pulse text-base">
                              Đang tính phí...
                            </span>
                          ) : type.cost !== null ? (
                            <span className="text-green-600 font-semibold text-base">
                              {type.cost.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-base">
                              Không có giá trị
                            </span>
                          )}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </CollapsibleSection>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 text-base font-medium transition-colors duration-200 shadow"
                >
                  {productId ? "Cập Nhật Sản Phẩm" : "Đăng Sản Phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DndProvider>
    </>
  );
};

export default ProductCreationForm;
