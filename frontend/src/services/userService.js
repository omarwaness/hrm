import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/user"; // Adjust base URL as needed


/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<object>} user data or error
 */
export const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${email}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};


/**
 * Get all users with role 'employee'
 * @returns {Promise<Array>} list of employee users
 */
export const getEmployees = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/role/employee`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

export const deleteEmployee = async (_id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${_id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
