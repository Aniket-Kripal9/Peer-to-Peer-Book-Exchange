import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Mock current user until authentication is added
export const CURRENT_USER = {
  name: "Aniket Kripal",
  department: "CSE",
  semester: "6th",
};

// ---------- Books ----------
export const getBooks = (params = {}) => API.get("/books", { params });
export const getBookById = (id) => API.get(`/books/${id}`);
export const createBook = (data) => API.post("/books", data);
export const updateBook = (id, data) => API.put(`/books/${id}`, data);
export const deleteBook = (id) => API.delete(`/books/${id}`);

// ---------- Requests ----------
export const getRequests = (params = {}) => API.get("/requests", { params });
export const createRequest = (data) => API.post("/requests", data);
export const updateRequestStatus = (id, status) =>
  API.put(`/requests/${id}`, { status });
export const deleteRequest = (id) => API.delete(`/requests/${id}`);

export default API;
