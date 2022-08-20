import axios from 'axios';
import { LoginRequest } from '@lms-monorepo/types';

export function fetchLogin(body: LoginRequest) {
  return axios({
    url: 'http://localhost:7002/api/v1/auth/login',
    method: 'post',
    withCredentials: true,
    data: body,
  });
}

export function fetchLogout() {
  return axios({
    url: 'http://localhost:7002/api/v1/auth/logout',
    method: 'delete',
    withCredentials: true,
  });
}

export function fetchValidateSession() {
  return axios({
    url: 'http://localhost:7002/api/v1/auth/session',
    method: 'get',
    withCredentials: true,
  });
}

export function fetchCurrentRole() {
  return axios({
    url: 'http://localhost:7002/api/v1/auth/role',
    method: 'get',
    withCredentials: true,
  });
}
