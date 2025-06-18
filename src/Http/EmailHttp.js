import api from "../config/interceptor-config";

export async function requestEmailConfirmationCode(userId, email) {
  try {
    const response = await api.get(
      `/user_code/user/send_code?userId=${userId}&email=${email}`
    );
    return response.data;
  } catch (error) {
    console.error("Error requesting email confirmation code:", error);
    throw error;
  }
}

export async function verifyEmailConfirmationCode(userId, email, code) {
  try {
    await api.post(
      `/user_code/user/confirm_code/${userId}`,
      {
        email: email,
        code: code,
      }
    );
    return true;
  } catch (error) {
    console.error("Error verifying email confirmation code:", error);
    throw error;
  }
}
