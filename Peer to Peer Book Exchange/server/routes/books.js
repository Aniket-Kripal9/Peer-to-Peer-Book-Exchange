// Automatically switch between local backend and Render deployment
const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://peer-to-peer-book-exchange-ruse.onrender.com/api');

// --- Auth Helpers ---
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
  window.dispatchEvent(new Event('authChange'));
};

export const logoutUser = () => {
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('authChange'));
};

export const registerUserApi = async (userData) => {
  const res = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
};

export const loginUserApi = async (credentials) => {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Invalid email or password');
  }
  return data;
};

// --- Books API ---
export const getBooks = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.search && params.search.trim()) {
      queryParams.append('search', params.search.trim());
    }
    if (params.category && params.category !== 'All') {
      queryParams.append('category', params.category);
    }

    const qs = queryParams.toString();
    const url = qs ? `${API_URL}/books?${qs}` : `${API_URL}/books`;

    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch books: ${res.status}`);
      return [];
    }
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.books)) return data.books;
    return [];
  } catch (err) {
    console.error('Error fetching books:', err);
    return [];
  }
};

export const getBookById = async (id) => {
  const res = await fetch(`${API_URL}/books/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch book');
  }
  return data._id ? data : data.book;
};

export const createBook = async (bookData) => {
  const res = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create book');
  }
  return data;
};

export const updateBook = async (id, bookData) => {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update book');
  }
  return data;
};

export const deleteBook = async (id) => {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete book');
  }
  return data;
};

// --- Requests API ---
export const getRequests = async (ownerEmail = '') => {
  const user = getCurrentUser();
  const res = await fetch(`${API_URL}/requests?ownerEmail=${ownerEmail}`, {
    headers: {
      'x-user-id': user?._id || '',
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch requests');
  }
  return Array.isArray(data) ? data : [];
};

export const createRequest = async (requestData) => {
  const user = getCurrentUser();
  const res = await fetch(`${API_URL}/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': user?._id || '',
    },
    body: JSON.stringify(requestData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to send exchange request');
  }
  return data;
};

export const updateRequestStatus = async (id, status) => {
  const user = getCurrentUser();
  const res = await fetch(`${API_URL}/requests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': user?._id || '',
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update request');
  }
  return data;
};

export const deleteRequest = async (id) => {
  const user = getCurrentUser();
  const res = await fetch(`${API_URL}/requests/${id}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': user?._id || '',
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to cancel request');
  }
  return data;
};