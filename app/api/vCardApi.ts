import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export const vCardApi = {
  getVCardPreview: async (vCardId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vcard-preview/${vCardId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vCard preview:', error);
      throw error;
    }
  },

  handleScan: async (vCardId: string, scanType: 'QR' | 'Link' | 'Preview') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/scan/${vCardId}`, { scanType });
      return response.data;
    } catch (error) {
      console.error('Error recording scan:', error);
      throw error;
    }
  },

  // Add other vCard-related API calls here
};
