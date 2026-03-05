export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  tenantId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'agent' | 'viewer';

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
  tenantId?: string;
}

export interface OtpPayload {
  email: string;
  otp: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface GoogleAuthPayload {
  idToken: string;
}
