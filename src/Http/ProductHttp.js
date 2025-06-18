import axios from "axios";

export async function fetchData(url) {

  const response = await fetch(url);
  const resData = await response.json();

  if (!response.ok) {
    throw new Error('Failed to fetch places');
  }

  return resData.productRatingOrderResponses;
}


export async function getProductById(id) {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/v1/product/get_product_detail/${id}`
    );

    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch product.");
  }
}

export async function getProductsByPage(page = 0, limit = 10) {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/v1/product/get_all_with_rating_order?page=${page}&limit=${limit}`
    );

    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch products.");
  }
}
