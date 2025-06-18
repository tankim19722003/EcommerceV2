import { useState, useEffect } from "react";
import { Check, X, Trash, Edit } from "lucide-react";
import Swal from "sweetalert2";
import { createAttribute, deleteAttribute, getAttributes, updateAttribute } from "../../Http/AttributeHttp";

const AttributeTab = () => {
  const [attributeForm, setAttributeForm] = useState({ name: "" });
  const [attributes, setAttributes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null); // { id, name }

  // Fetch attributes on component mount
  useEffect(() => {
    console.log("AttributeTab useEffect called");
    const fetchAttributes = async () => {
      try {
        setIsFetching(true);
        const attributes = await getAttributes();
        setAttributes(attributes ? attributes : []);
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
        Swal.fire(
          "Error!",
          "Failed to fetch attributes! Please check if the server is running.",
          "error"
        );
      }
    };

    fetchAttributes();
  }, []);

  // Handle attribute form changes (for create)
  const handleAttributeFormChange = (e) => {
    const { name, value } = e.target;
    setAttributeForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle edit input changes
  const handleEditFormChange = (e) => {
    setEditingAttribute((prev) => ({ ...prev, name: e.target.value }));
  };

  // Handle attribute form submission (create)
  const handleAttributeFormSubmit = async (e) => {
    e.preventDefault();
    const { name } = attributeForm;

    if (!name) {
      Swal.fire("Error!", "Please enter an attribute name!", "error");
      return;
    }

    try {
      setIsFetching(true);
      const response = await createAttribute(name);
      setAttributes((prev) => [
        ...prev,
        { id: response.id, name: response.name },
      ]);
      setIsFetching(false);
      Swal.fire("Success!", "Tạo thuộc tính thành công!", "success");
      setAttributeForm({ name: "" });
    } catch (error) {
      setIsFetching(false);
      Swal.fire("Error!", "Tạo thuộc tính thất bại!", "error");
    }
  };

  // Handle attribute deletion
  const handleDeleteAttribute = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setIsFetching(true);
        await deleteAttribute(id);

        setAttributes((prev) => prev.filter((attr) => attr.id !== id));
        setIsFetching(false);
        Swal.fire("Deleted!", "Thuộc tính sẽ bị xóa.", "success");
      } catch (error) {
        setIsFetching(false);
        Swal.fire(
          "Error!",
          "Failed to delete attribute. Please try again.",
          "error"
        );
      }
    }
  };

  // Start editing an attribute
  const startEditing = (attribute) => {
    setEditingAttribute({ id: attribute.id, name: attribute.name });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingAttribute(null);
  };

  // Handle attribute update
  const handleUpdateAttribute = async (e) => {
    e.preventDefault();
    if (!editingAttribute.name) {
      Swal.fire("Error!", "Please enter an attribute name!", "error");
      return;
    }

    try {
      setIsFetching(true);
      const updatedAttribute = await updateAttribute({
        id: editingAttribute.id,
        name: editingAttribute.name
      });

      setAttributes((prev) =>
        prev.map((attr) =>
          attr.id === updatedAttribute.id
            ? { id: updatedAttribute.id, name: updatedAttribute.name }
            : attr
        )
      );
      setIsFetching(false);
      setEditingAttribute(null);
      Swal.fire("Success!", "Cập nhật thuộc tính thành công!", "success");
    } catch (error) {
      setIsFetching(false);
      Swal.fire("Error!", "Cập nhật thuộc tính thất bại!", "error");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-6">
        Tạo thuộc tính
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên thuộc tính
          </label>
          <input
            type="text"
            name="name"
            value={attributeForm.name}
            onChange={handleAttributeFormChange}
            placeholder="Enter attribute name"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAttributeFormSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
            disabled={!attributeForm.name || isFetching}
          >
            <Check size={16} /> Tạo thuộc tính
          </button>
          <button
            onClick={() => setAttributeForm({ name: "" })}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-sm flex items-center gap-1"
            disabled={isFetching}
          >
            <X size={16} /> Hủy
          </button>
        </div>
      </div>
      {/* Attribute List */}
      {attributes.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-700 mb-4">
            Danh sách thuộc tính
          </h4>
          <ul className="divide-y divide-gray-100">
            {attributes.map((attribute) => (
              <li
                key={attribute.id}
                className="py-2 px-4 bg-gray-50 rounded-md my-1 flex justify-between items-center text-sm text-gray-600"
              >
                {editingAttribute && editingAttribute.id === attribute.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={editingAttribute.name}
                      onChange={handleEditFormChange}
                      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-48"
                    />
                    <button
                      onClick={handleUpdateAttribute}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
                      disabled={!editingAttribute.name || isFetching}
                    >
                      <Check size={16} /> Update
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-sm flex items-center gap-1"
                      disabled={isFetching}
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{attribute.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(attribute)}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center gap-1"
                        disabled={isFetching || editingAttribute}
                      >
                        <Edit size={16} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteAttribute(attribute.id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm flex items-center gap-1"
                        disabled={isFetching || editingAttribute}
                      >
                        <Trash size={16} /> Xóa
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AttributeTab;
