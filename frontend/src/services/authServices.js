const API_BASE_URL = 'http://localhost:5000/api/auth';

export async function registerUser(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to register user');
    }

    return { success: true, message: data.message };
  } catch (error) {
    const message = error.message || 'Failed to register user';
    return { success: false, message };
  }
}
