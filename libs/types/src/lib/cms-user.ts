export interface User {
  id: string;
  name: string;
  email: string;
}

export interface GetUsersResponse {
  data: { users: Array<User> };
  message: string;
  status: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
}

export type CreateUserResponse = {
  data: null;
  message: string;
  status: string;
}
