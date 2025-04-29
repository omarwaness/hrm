const API_BASE_URL = "http://localhost:5000/api/user"; // Adjust base URL as needed

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<object>} user data or error
 */
export const getUserByEmail = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${email}`);

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error.message ? error : { message: "Network error" };
  }
};

/**
 * Get all users with role 'employee'
 * @returns {Promise<Array>} list of employee users
 */
export const getEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/role/employee`);

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error.message ? error : { message: "Network error" };
  }
};

/**
 * Delete an employee by ID
 * @param {string} _id
 * @returns {Promise<object>} server response
 */
export const deleteEmployee = async (_id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${_id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error.message ? error : { message: "Network error" };
  }
};
