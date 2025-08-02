import { api } from "../config/interceptor-config";

export async function createOrder(order) {
    try {
          await api.post("http://localhost:8080/api/v1/order", order);
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}