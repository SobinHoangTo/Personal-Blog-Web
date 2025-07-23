export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  accessToken: string;
  email: string;
  fullName: string;
  role: string;
  expiresIn: number;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  avatar?: string;
}
