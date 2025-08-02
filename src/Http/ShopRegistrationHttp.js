import { api } from "../config/interceptor-config";

export async function registerShop({
  shopName,
  description,
  villageId,
  specificAddress,
  phoneNumber,
  email,
  frontCccd,
  behindCccd,
  userId,
}) {
  const data = new FormData();
  data.append("shopName", shopName);
  data.append("description", description);
  data.append("villageId", villageId);
  data.append("specificAddress", specificAddress);
  data.append("phoneNumber", phoneNumber);
  data.append("email", email);

  // Files
  // write logic to make sure is a cccd image
  if (frontCccd) data.append("frontCccd", frontCccd);
  if (behindCccd) data.append("behindCccd", behindCccd);

  try {
    const response = await api.post(`/shop/register/${userId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "An error occurred while registering the shop.");
  }
}
