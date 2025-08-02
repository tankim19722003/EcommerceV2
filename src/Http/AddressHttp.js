import { api } from "../config/interceptor-config";

export async function getAllProvinces() {
  try {
    const response = await api.get("/user_village/get_all_provinces");
    return response.data;
  } catch (error) {
    console.error("There was a problem with the axios operation:", error);
  }
}

export async function getDistrictsByProvinceId(provinceId) {
  try {
    const response = await api.get(
      `/user_village/get_all_districts/${provinceId}`
    );
    return response.data;
  } catch (error) {
    console.error("There was a problem with the axios operation:", error);
  }
}

export async function getVillageByDistrictId(districtId) {
  try {
    const response = await api.get(
      `/user_village/get_all_villages/${districtId}`
    );
    return response.data;
  } catch (error) {
    console.error("There was a problem with the axios operation:", error);
  }
}