import axios from "axios";
import { api } from "../config/interceptor-config";

export async function createCategory(categoryData) {
  try {
    const response = await api.post("/category/create", categoryData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function getCategories() {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/v1/category/get_all_categories"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

//  http for subcategory
export async function getSubcategoryByCategoryId(categoryId) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/sub_category/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
}

export async function createSubcategory(subcategoryData) {
  try {
    const response = await api.post(
      "http://localhost:8080/api/v1/sub_category",
      subcategoryData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating subcategory:", error);
    throw error;
  }
}

// http for attribute

// export async function createAttribute()
