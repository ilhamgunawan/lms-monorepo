export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface CurrentRoleResponse {
  data: {
    role: Role;
  }
}
