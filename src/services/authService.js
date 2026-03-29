import { apiClient, ApiError } from '../lib/api.js';

class AuthService {
  // User signup
  async signup(name, email, password) {
    try {
      const response = await apiClient.post('/api/auth/signup', {
        name,
        email,
        password
      });

      if (response.success && response.data.token) {
        apiClient.setToken(response.data.token);
      }

      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  // User login
  async login(email, password) {
    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password
      });

      if (response.success && response.data.token) {
        apiClient.setToken(response.data.token);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(name) {
    try {
      const response = await apiClient.put('/api/auth/profile', { name });
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Logout user
  logout() {
    apiClient.setToken(null);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiClient.getToken();
  }

  // Get stored token
  getToken() {
    return apiClient.getToken();
  }

  // Handle authentication errors
  handleAuthError(error) {
    if (error instanceof ApiError) {
      if (error.isUnauthorized()) {
        // Token expired or invalid, clear it
        this.logout();
        return { requiresReauth: true, message: 'Session expired. Please login again.' };
      }
    }
    return { requiresReauth: false, message: error.message };
  }
}

// Create singleton instance
export const authService = new AuthService();

export default authService;
