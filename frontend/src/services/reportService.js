const API_BASE_URL = "http://localhost:5000/api/reports"; // Update if your backend is hosted elsewhere

/**
 * Save a report
 * @param {Object} reportData - The report data to save
 * @param {string} reportData.employeeEmail
 * @param {string} reportData.employeeFirstName
 * @param {string} reportData.employeeLastName
 * @param {number} reportData.totalRequests
 * @param {Array<{ month: string, requests: number }>} reportData.breakdown
 * @returns {Promise<object>} Response from the server
 */
export const saveReport = async (reportData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data; // Backend sends { message: "..." }
    }

    return data;
  } catch (error) {
    throw error.message ? error : { message: "Network error" };
  }
};

// Get all reports
export const getAllReports = async () => {
  try {
    const response = await fetch(API_BASE_URL);

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error.message ? error : { message: "Network error" };
  }
};
