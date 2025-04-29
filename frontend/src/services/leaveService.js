const API_BASE_URL = "http://localhost:5000/api/leave"; // adjust to your actual backend base path

/**
 * Get leave requests by email
 * @param {string} email
 * @returns {Promise<object[]>} Array of leave requests (only with createdAt field)
 */
export const getLeaveRequestsByEmail = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${email}`);

    const data = await response.json();

    if (!response.ok) {
      throw data; // the backend should send { message: "..." }
    }

    return data;
  } catch (error) {
    throw error.message ? error : { message: "Network error" };
  }
};
