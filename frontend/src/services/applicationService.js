const API_URL = 'http://localhost:5000/api/applications';

// Function to apply for a job (submit application with file upload)
export const applyForJob = async (applicationData) => {
  try {
    const formData = new FormData();
    formData.append('email', applicationData.email);
    formData.append('jobId', applicationData.jobId);
    formData.append('cv', applicationData.cv); // This must be a File object

    const response = await fetch(`${API_URL}/apply`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to apply for job');
    }

    return await response.json();
  } catch (error) {
    console.error("Error applying for job:", error);
    throw error;
  }
};

// Function to get all applications
export const getAllApplications = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch applications, Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};

// Function to get a single application by ID
export const getApplicationById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch application');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching application with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete an application by ID
export const deleteApplication = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete application');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting application with ID ${id}:`, error);
    throw error;
  }
};

// For backwards compatibility if any code still uses deleteJob
export const deleteJob = deleteApplication;

// Function to send email notification
export const sendEmail = async (emailData) => {
  try {
    const response = await fetch('http://localhost:5000/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
