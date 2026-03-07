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
  
  toggleStatus: (id: string) => axios.patch(`/members/${id}/toggle-status`),
  
  delete: (id: string) => axios.delete(`/members/${id}`),
  
  getProfile: () => axios.get('/members/profile'),
  
  updateProfile: (data: any) => axios.put('/members/profile', data),
};

// Plan APIs
export const planAPI = {
  getAll: () => axios.get('/plans'),
  
  getById: (id: string) => axios.get(`/plans/${id}`),
  
  create: (data: { 
    name: string; 
    price: number; 
    discountPrice?: number; 
    duration: number;
    planType?: string;
    features?: string;
  }) => axios.post('/plans', data),
  
  update: (id: string, data: { 
    name?: string; 
    price?: number; 
    discountPrice?: number; 
    duration?: number; 
    planType?: string;
    features?: string;
    isActive?: boolean;
  }) => axios.put(`/plans/${id}`, data),
  
  delete: (id: string) => axios.delete(`/plans/${id}`),
};

// Attendance APIs
export const attendanceAPI = {
  getAll: (params?: { startDate?: string; endDate?: string }) => 
    axios.get('/attendance', { params }),
  
  checkIn: () => 
    axios.post('/attendance/checkin'),
  
  adminCheckIn: (memberId: string) => 
    axios.post('/attendance/check-in', { memberId }),
  
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
  getAdminStats: () => axios.get('/dashboard/summary'),
  
  getMemberStats: () => axios.get('/dashboard/member'),
};

// User APIs
export const userAPI = {
  getProfile: () => axios.get('/users/profile'),
  
  updateProfile: (data: any) => axios.put('/users/profile', data),
  
  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    return axios.post('/users/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    axios.put('/users/change-password', data),
};

// Event APIs
export const eventAPI = {
  getAll: (params?: { upcoming?: boolean; past?: boolean }) => 
    axios.get('/events', { params }),
  
  getById: (id: string) => axios.get(`/events/${id}`),
  
  getUpcoming: (limit?: number) => 
    axios.get('/events/upcoming', { params: { limit } }),
  
  create: (data: {
    title: string;
    description?: string;
    type: string;
    date: string;
    time: string;
    duration?: number;
    location?: string;
    maxParticipants?: number;
    instructor?: string;
  }) => axios.post('/events', data),
  
  update: (id: string, data: any) => axios.put(`/events/${id}`, data),
  
  delete: (id: string) => axios.delete(`/events/${id}`),
  
  register: (eventId: string, memberId: string) => 
    axios.post('/events/register', { eventId, memberId }),
  
  cancelRegistration: (eventId: string, memberId: string) => 
    axios.post('/events/cancel', { eventId, memberId }),
};

// Portfolio APIs
export const portfolioAPI = {
  getAll: (params?: { type?: string; section?: string; published?: boolean }) => 
    axios.get('/portfolio', { params }),
  
  getById: (id: string) => axios.get(`/portfolio/${id}`),
  
  getPublished: (params?: { type?: string; section?: string }) => 
    axios.get('/portfolio/published', { params }),
  
  create: (formData: FormData) => 
    axios.post('/portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  update: (id: string, formData: FormData) => 
    axios.put(`/portfolio/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  delete: (id: string) => axios.delete(`/portfolio/${id}`),
};

// Gym APIs
export const gymAPI = {
  getSettings: () => axios.get('/gym/settings'),
  
  updateSettings: (data: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    description?: string;
    logo?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    admissionCharge?: string;
    monthlyCharge?: string;
    morningTiming?: string;
    eveningTiming?: string;
  }) => axios.put('/gym/settings', data),
};
