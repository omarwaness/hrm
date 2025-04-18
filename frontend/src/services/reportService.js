import axios from "axios";



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
    const response = await axios.post(API_BASE_URL, reportData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Get all reports
export const getAllReports = async () => {
    const response = await axios.get(API_BASE_URL)
    return response.data
  }
