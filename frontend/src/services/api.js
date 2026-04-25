import axios from "axios";

const API = axios.create({
  baseURL: "https://beauty-salon-platform-production.up.railway.app/api",
});

// Attach token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Salon APIs
export const getSalons = () => API.get("/salons");
export const getSalon = (id) => API.get(`/salons/${id}`);
export const createSalon = (data) => API.post("/salons", data);
export const deleteSalon = (id) => API.delete(`/salons/${id}`);

// User APIs
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);

// Booking APIs
export const createBooking = (data) => API.post("/bookings", data);
export const getBookings = () => API.get("/bookings");
export const updateBooking = (id, data) => API.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);

// Review APIs
export const getReviews = (salonId) => API.get(`/reviews/${salonId}`);
export const createReview = (data) => API.post("/reviews", data);

export default API;