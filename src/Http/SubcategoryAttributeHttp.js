import { api } from "../config/interceptor-config";

export async function createSubcategoryAttribute(data) {
  try {
    const response = await api.post("/subcategory_attribute/add_one", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to create subcategory attribute"
    );
  }
}
