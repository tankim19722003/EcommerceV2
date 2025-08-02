import { api } from "../config/interceptor-config";

export async function getAttributes() {
  try {
    const response = await api.get("http://localhost:8080/api/v1/attribute");
    return response.data;
  } catch (error) {
    throw new Error(error || "Failed to fetch the attributes");
  }
}

export async function createAttribute(attribute) {
  try {
    const response = await api.post("/attribute/add_attribute", {
      name: attribute,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to create attribute"
    );
  }
}

export async function deleteAttribute(attributeId) {
  try {
    const response = await api.delete(`/attribute/${attributeId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete attribute"
    );
  }
}

export async function updateAttribute(attribute) {
  try {
    const response = await api.put("/attribute", attribute);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to update attribute"
    );
  }
}
