import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth'

export async function registerUser(formData) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/register`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return { success: true, message: response.data.message };
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || 'Failed to register user';
    return { success: false, message };
  }
}
