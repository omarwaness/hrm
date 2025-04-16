
import axios from "axios"


const API_BASE_URL = "http://localhost:5000/api/leave"; // adjust to your actual backend base path

/**
 * Get leave requests by email
 * @param {string} email
 * @returns {Promise<object[]>} Array of leave requests (only with createdAt field)
 */

export const getLeaveRequestsByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${email}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
