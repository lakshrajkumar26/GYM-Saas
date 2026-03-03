import axios from './axios';

// Auth APIs
export const authAPI = {
  login: (data: { email: string; password: string }) => 
    axios.post('/auth/login', data),
  
  register: (data: { name: string; email: string; password: string; phone?: string; address?: string }) => 
    axios.post('/auth/register', data),
};

// Member APIs
export const memberAPI = {
  getAll: () => axios.get('/members'),
  
  getById: (id: string) => axios.get(`/members/${id}`),
  
  create: (data: any) => axios.post('/members', data),
  
  update: (id: string, data: any) => axios.put(`/members/${id}`, data),
  
  delete: (id: string) => axios.delete(`/members/${id}`),
  
  getProfile: () => axios.get('/members/profile'),
  
  updateProfile: (data: any) => axios.put('/members/profile', data),
};

// Plan APIs
export const planAPI = {
  getAll: () => axios.get('/plans'),
  
  getById: (id: string) => axios.get(`/plans/${id}`),
  
  create: (data: { name: string; price: number; duration: number }) => 
    axios.post('/plans', data),
  
  update: (id: string, data: { name?: string; price?: number; duration?: number; isActive?: boolean }) => 
    axios.put(`/plans/${id}`, data),
  
  delete: (id: string) => axios.delete(`/plans/${id}`),
};

// Attendance APIs
export const attendanceAPI = {
  getAll: (params?: { startDate?: string; endDate?: string }) => 
    axios.get('/attendance', { params }),
  
  checkIn: (memberId: string) => 
    axios.post('/attendance/checkin', { memberId }),
  
  getMyAttendance: (params?: { startDate?: string; endDate?: string }) => 
    axios.get('/attendance/my', { params }),
};

// Payment APIs
export const paymentAPI = {
  getAll: (params?: { startDate?: string; endDate?: string }) => 
    axios.get('/payments', { params }),
  
  getById: (id: string) => axios.get(`/payments/${id}`),
  
  create: (data: { memberId: string; amount: number; mode: string; planId?: string; reference?: string }) => 
    axios.post('/payments', data),
  
  getMyPayments: () => axios.get('/payments/my'),
};

// Dashboard APIs
export const dashboardAPI = {
  getAdminStats: () => axios.get('/dashboard/admin'),
  
  getMemberStats: () => axios.get('/dashboard/member'),
};

// User APIs
export const userAPI = {
  getProfile: () => axios.get('/user/profile'),
  
  updateProfile: (data: any) => axios.put('/user/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    axios.put('/user/change-password', data),
};
