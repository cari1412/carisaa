// lib/auth-service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev.prospecttrade.org/api';

export interface RegisterData {
  fullName: string;
  companyName?: string;
  email: string;
  password: string;
  planId?: string;
  billingCycle?: 'MONTHLY' | 'YEARLY';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  role: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId?: string;
  selectedPlanId?: string;
  selectedBillingCycle?: string;
  subscription?: {
    status: string;
    planId: string;
    billingCycle: string;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load tokens from localStorage on init
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser);
        } catch (e) {
          console.error('Failed to parse saved user:', e);
        }
      }
    }
  }

  async register(data: RegisterData): Promise<{ message: string; email: string }> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const authData = await response.json();
    this.setTokens(authData.accessToken, authData.refreshToken);
    this.setUser(authData.user);
    return authData;
  }

  async verifyEmail(data: VerifyEmailData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Verification failed');
    }

    const authData = await response.json();
    
    // Если сервер вернул токены, сохраняем их
    if (authData.accessToken && authData.refreshToken) {
      this.setTokens(authData.accessToken, authData.refreshToken);
      this.setUser(authData.user);
    }
    
    return authData;
  }

  async resendVerificationCode(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to resend code');
    }

    return response.json();
  }

  async refreshAccessToken(): Promise<AuthResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (!response.ok) {
      this.logout();
      throw new Error('Token refresh failed');
    }

    const authData = await response.json();
    this.setTokens(authData.accessToken, authData.refreshToken);
    this.setUser(authData.user);
    return authData;
  }

  async logout(): Promise<void> {
    if (this.accessToken) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    this.clearTokens();
  }

  async getMe(): Promise<User> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (response.status === 401) {
      // Try to refresh token
      await this.refreshAccessToken();
      // Retry request
      return this.getMe();
    }

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    const userData = await response.json();
    this.setUser(userData);
    return userData;
  }

  // Публичные методы для управления токенами и пользователем
  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  setUser(user: User): void {
    this.user = user;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUser(): User | null {
    return this.user;
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Проверка валидности токена
  isTokenValid(): boolean {
    const token = this.accessToken;
    if (!token) return false;
    
    try {
      // Декодируем JWT токен
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp * 1000; // конвертируем в миллисекунды
      
      // Проверяем не истек ли токен
      const isValid = Date.now() < exp;
      console.log('Token validation:', {
        exp: new Date(exp),
        now: new Date(),
        isValid
      });
      
      return isValid;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Дебаг метод для проверки состояния
  debugAuthState(): void {
    console.log('=== Auth State Debug ===');
    console.log('Access Token:', this.accessToken ? `${this.accessToken.substring(0, 20)}...` : 'null');
    console.log('Refresh Token:', this.refreshToken ? 'exists' : 'null');
    console.log('User:', this.user);
    console.log('Is Authenticated:', this.isAuthenticated());
    console.log('Is Token Valid:', this.isTokenValid());
    if (typeof window !== 'undefined') {
      console.log('LocalStorage tokens:', {
        access: localStorage.getItem('accessToken') ? 'exists' : 'null',
        refresh: localStorage.getItem('refreshToken') ? 'exists' : 'null'
      });
    }
    console.log('======================');
  }

  // Восстановление состояния авторизации из localStorage
  async restoreAuthState(): Promise<User | null> {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      // Проверяем валидность токена
      if (!this.isTokenValid()) {
        // Пробуем обновить токен
        await this.refreshAccessToken();
      }

      // Если пользователь уже загружен, возвращаем его
      if (this.user) {
        return this.user;
      }

      // Иначе загружаем данные пользователя
      return await this.getMe();
    } catch (error) {
      console.error('Failed to restore auth state:', error);
      this.clearTokens();
      return null;
    }
  }
}

export const authService = new AuthService();