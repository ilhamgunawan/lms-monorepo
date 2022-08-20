export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  id: string;
  name: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
}

export interface LoginResponse {
  data: LoginData;
  message: string;
  status: string;
}

export interface ValidateSessionResponse {
  message: string;
}
