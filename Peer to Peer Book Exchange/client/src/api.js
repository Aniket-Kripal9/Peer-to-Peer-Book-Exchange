import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Helper to get current user from LocalStorage
export const getCurrentUser = () => {
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Error reading localStorage user:', err);
  }
  return { name: 'Aniket Kripal', department: 'CSE', semester: '6th' };
};

// Default export object for legacy support
export const CURRENT_USER = getCurrentUser();

// --- AUTH API ---
export const registerUserApi = async (userData) => {
  const res = await api.post('/users/register', userData);
  return res.data;
};

export const loginUserApi = async (credentials) => {
  const res = await api.post('/users/login', credentials);
  return res.data;
};

// --- BOOKS API ---
export const getBooks = async (search = '', category = '') => {
  const params = {};
  if (search) params.search = search;
  if (category) params.category = category;
  const res = await api.get('/books', { params });
  return res.data;
};

export const getBookById = async (id) => {
  const res = await api.get(`/books/${id}`);
  return res.data;
};

export const createBook = async (bookData) => {
  const user = getCurrentUser();
  const newBook = {
    ...bookData,
    ownerName: user.name || 'Aniket Kripal',
    ownerDepartment: user.department || 'CSE',
    ownerSemester: user.semester || '6th',
  };
  const res = await api.post('/books', newBook);
  return res.data;
};

export const updateBook = async (id, bookData) => {
  const res = await api.put(`/books/${id}`, bookData);
  return res.data;
};

export const deleteBook = async (id) => {
  const res = await api.delete(`/books/${id}`);
  return res.data;
};

// --- REQUESTS API ---
export const getRequests = async (filters = {}) => {
  const res = await api.get('/requests', { params: filters });
  return res.data;
};

export const createRequest = async (bookId, ownerName) => {
  const user = getCurrentUser();
  const requestData = {
    book: bookId,
    ownerName: ownerName,
    requesterName: user.name || 'Aniket Kripal',
    requesterDepartment: user.department || 'CSE',
    requesterSemester: user.semester || '6th',
  };
  const res = await api.post('/requests', requestData);
  return res.data;
};

export const updateRequestStatus = async (id, status) => {
  const res = await api.put(`/requests/${id}`, { status });
  return res.data;
};

export const deleteRequest = async (id) => {
  const res = await api.delete(`/requests/${id}`);
  return res.data;
};

export default api;