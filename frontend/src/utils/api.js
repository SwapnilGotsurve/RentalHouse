// API utility functions for making HTTP requests

const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  // Add token to headers if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

// Booking API functions
export const bookingAPI = {
  // Get all bookings with optional filters
  getBookings: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/bookings${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(endpoint);
  },

  // Get single booking by ID
  getBooking: async (id) => {
    return apiCall(`/bookings/${id}`);
  },

  // Update booking status
  updateBookingStatus: async (id, status, notes = '') => {
    return apiCall(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  },

  // Add message to booking
  addMessage: async (id, message) => {
    return apiCall(`/bookings/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  },

  // Upload documents
  uploadDocuments: async (id, formData) => {
    return apiCall(`/bookings/${id}/documents`, {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData
    });
  }
};

// Property API functions
export const propertyAPI = {
  // Get all properties
  getProperties: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/properties${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(endpoint);
  },

  // Get single property
  getProperty: async (id) => {
    return apiCall(`/properties/${id}`);
  }
};

// User API functions
export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    return apiCall('/auth/me');
  },

  // Update user profile
  updateProfile: async (userData) => {
    return apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }
};

export default {
  apiCall,
  bookingAPI,
  propertyAPI,
  userAPI
};