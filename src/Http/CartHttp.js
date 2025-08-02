import { api } from "../config/interceptor-config";

export async function addItemToCart(cartItem) {
  try {
    const response = await api.post("/cart/add-product-to-cart", cartItem)
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function getAllCartItems() {
  try {
    const response = await api.get("/cart/get-all-cart-items")
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}