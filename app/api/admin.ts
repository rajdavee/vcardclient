import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in every request
adminApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const fetchAdminData = async () => {
  try {
    const [
      usersResponse,
      statsResponse,
      userAnalyticsResponse,
      vCardAnalyticsResponse,
      recentActivityResponse
    ] = await Promise.all([
      adminApi.get('/admin/users'),
      adminApi.get('/admin/stats'),
      adminApi.get('/admin/analytics/users'),
      adminApi.get('/admin/analytics/vcards'),
      adminApi.get('/admin/analytics/recent-activity')
    ]);

    return {
      users: usersResponse.data,
      stats: statsResponse.data,
      userAnalytics: userAnalyticsResponse.data,
      vCardAnalytics: vCardAnalyticsResponse.data,
      recentActivity: recentActivityResponse.data
    };
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw error;
  }
};

export const searchUsers = async (query: string) => {
  try {
    const response = await adminApi.get(`/admin/search/users?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

export const promoteToAdmin = async (userId: string) => {
  try {
    const response = await adminApi.put(`/admin/users/${userId}/promote-to-admin`);
    return response.data;
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    throw error;
  }
};

export const updateUserPlan = async (userId: string, planName: string, price: number) => {
  try {
    const response = await adminApi.put(`/admin/users/${userId}/plan`, { planName, price });
    return response.data;
  } catch (error) {
    console.error('Error updating user plan:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await adminApi.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const addUser = async (userData: any) => {
  try {
    const response = await adminApi.post('/admin/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const editUser = async (userId: string, userData: any) => {
  try {
    const response = await adminApi.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error editing user:', error);
    throw error;
  }
};

export const getAllVCards = async () => {
  try {
    const response = await adminApi.get('/admin/vcards');
    return response.data;
  } catch (error) {
    console.error('Error fetching all vCards:', error);
    throw error;
  }
};

export const getVCardById = async (vCardId: string) => {
  try {
    const response = await adminApi.get(`/admin/vcards/${vCardId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vCard:', error);
    throw error;
  }
};

export const updateVCard = async (vCardId: string, vCardData: any) => {
  try {
    console.log(`Updating vCard with ID: ${vCardId}`);
    console.log('Update data:', vCardData);
    const response = await adminApi.put(`/admin/vcards/${vCardId}`, vCardData);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating vCard:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
    }
    throw error;
  }
};

export const deleteVCard = async (vCardId: string) => {
  try {
    console.log(`Deleting vCard with ID: ${vCardId}`);
    const response = await adminApi.delete(`/admin/vcards/${vCardId}`);
    console.log('Delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting vCard:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', error.response?.data);
    }
    throw error;
  }
};

export const getUserVCards = async (userId: string) => {
  try {
    console.log(`Fetching vCards for user: ${userId}`);
    const response = await adminApi.get(`/admin/users/${userId}/vcards`);
    console.log('User vCards fetched successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user vCards:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export const addTemplate = async (templateData: any) => {
  try {
    const response = await adminApi.post('/admin/templates', templateData);
    return response.data;
  } catch (error) {
    console.error('Error adding template:', error);
    throw error;
  }
};

export const updatePlanTemplates = async (planName: string, templates: number[]) => {
  try {
    console.log(`Updating templates for plan: ${planName}`, templates);
    const response = await adminApi.put(`/admin/plans/${planName}/templates`, { templates });
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating plan templates:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', error.response?.data);
    }
    throw error;
  }
};

export default adminApi;
