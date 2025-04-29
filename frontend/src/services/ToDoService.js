const API_URL = 'http://localhost:5000/api/ToDo';

export const getToDoByEmail = async (email) => {
  try {
    const res = await fetch(`${API_URL}/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to load ToDo');
    }
    
    const data = await res.json();
    return data.toDo || []; 
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const addToDo = async (email, task, favorite) => {
  try {
    const res = await fetch(`${API_URL}/addToDo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: email, task, favorite }),
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add ToDo');
    }
    
    return await res.json();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteToDo = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete ToDo');
    }
    
    return await res.json();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateToDoFavorite = async (id, favorite) => {
  try {
    const res = await fetch(`${API_URL}/favorite/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favorite }),
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update ToDo favorite status');
    }
    
    return await res.json();
  } catch (err) {
    console.log(err);
    throw err;
  }
};