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
  } catch (err) {
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
  return res.json();
};

export const loginUserApi = async (credentials) => {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return res.json();
};

// --- Books API ---
export const getBooks = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append('search', params.search);
  if (params.category && params.category !== 'All') queryParams.append('category', params.category);

  const res = await fetch(`${API_URL}/books?${queryParams.toString()}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const getBookById = async (id) => {
  const res = await fetch(`${API_URL}/books/${id}`);
  const data = await res.json();
  return data._id ? data : data.book;
};

export const createBook = async (bookData) => {
  const res = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });
  return res.json();
};

export const updateBook = async (id, bookData) => {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });
  return res.json();
};

export const deleteBook = async (id) => {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};

// --- Requests API (Updated with Security Headers) ---
export const getRequests = async (ownerEmail = '') => {
  const user = getCurrentUser();
  const res = await fetch(`${API_URL}/requests?ownerEmail=${ownerEmail}`, {
    headers: {
      'x-user-id': user?._id || ''
    }
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const createRequest = async (requestData) => {
  const user = getCurrentUser();
  const res = await fetch(`${API_URL}/requests`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-user-id': user?._id || ''
    },
    body: JSON.stringify(requestData),
  });
  return res.json();
};

export const updateRequestStatus = async (id, status) => {
  const user = getCurrentUser();
  const res = await fetch(`${API_URL}/requests/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'x-user-id': user?._id || ''
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const deleteRequest = async (id) => {
  const user = getCurrentUser();
  const res = await fetch(`${API_URL}/requests/${id}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': user?._id || ''
    }
  });
  return res.json();
};