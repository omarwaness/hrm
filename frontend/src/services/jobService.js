const API_URL = 'http://localhost:5000/api/jobs';


// Function to create a new job
export const createJob = async (jobData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create job');
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

// Function to get all jobs
export const getAllJobs = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs, Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("Using mock data due to API error:", error);
    return MOCK_JOBS; // Return mock data if the API fails
  }
};

// Function to get a job by ID
export const getJobById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }

    return await response.json();
  } catch (error) {
    console.warn(`Using mock job data for ID ${id} due to API error:`, error);
    return MOCK_JOBS.find(job => job.id === id) || MOCK_JOBS[0];
  }
};

// Function to update a job by ID
export const updateJob = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update job');
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

// Function to delete a job by ID
export const deleteJob = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete job');
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
