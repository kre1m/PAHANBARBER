import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  // Авторизация
  register(userData) {
    return api.post('/register', userData);
  },
  
  login(credentials) {
    return api.post('/login', credentials);
  },

  // Профиль
  getProfile() {
    return api.get('/profile');
  },

  updateProfile(userData) {
    return api.put('/profile', userData);
  },

  // Записи
  getAvailableSlots() {
    return api.get('/available-slots');
  },

  createAppointment(appointmentData) {
    return api.post('/appointments', appointmentData);
  },

  getAppointments() {
    return api.get('/appointments');
  },

  cancelAppointment(id) {
    return api.delete(`/appointments/${id}`);
  },

  // Отзывы
  createReview(reviewData) {
    return api.post('/reviews', reviewData);
  },

  updateReview(id, reviewData) {
    return api.put(`/reviews/${id}`, reviewData);
  },

  getAllReviews() {
    return api.get('/reviews');
  },

  getMyReviews() {
    return api.get('/reviews/my');
  },

  // Уведомления
  getNotifications() {
    return api.get('/notifications');
  },

  markNotificationRead(id) {
    return api.put(`/notifications/${id}/read`);
  },

  markAllNotificationsRead() {
    return api.put('/notifications/read-all');
  },

  // Админ - Записи
  adminGetAppointments(status) {
    return api.get('/admin/appointments', { params: { status } });
  },

  adminCreateAppointment(data) {
    return api.post('/admin/appointments', data);
  },

  adminCancelAppointment(id) {
    return api.delete(`/admin/appointments/${id}`);
  },

  // Админ - Отзывы
  adminGetReviews() {
    return api.get('/admin/reviews');
  },

  adminDeleteReview(id) {
    return api.delete(`/admin/reviews/${id}`);
  },

  // Админ - Расписание
  adminGetSchedule() {
    return api.get('/admin/schedule');
  },

  adminUpdateSchedule(id, data) {
    return api.put(`/admin/schedule/${id}`, data);
  },

  // Админ - Блокировки
  adminGetBlockedSlots() {
    return api.get('/admin/blocked-slots');
  },

  adminCreateBlockedSlot(data) {
    return api.post('/admin/blocked-slots', data);
  },

  adminDeleteBlockedSlot(id) {
    return api.delete(`/admin/blocked-slots/${id}`);
  },

  // Админ - Статистика
  adminGetStatistics() {
    return api.get('/admin/statistics');
  },

  adminGetClients() {
    return api.get('/admin/clients');
  }
};
