import axios, {AxiosPromise, AxiosResponse, AxiosError} from 'axios';
import { ErrorResponse, GetUsersResponse, CreateUserRequest, CreateUserResponse } from '@lms-monorepo/types';
import { useQuery, useMutation } from 'react-query';

export function fetchUsers() {
  return axios({
    url: 'http://localhost:7002/api/v1/users',
    method: 'get',
    withCredentials: true,
  });
}

export function useGetUsers() {
  return useQuery<AxiosResponse<GetUsersResponse>, AxiosError<ErrorResponse>>('users', fetchUsers, {
    retry: false,
  });
}

type OnError = (error: AxiosError<ErrorResponse>) => void;

type OnSuccess = (res: AxiosResponse<CreateUserResponse>) => void;

export function createUser(req: CreateUserRequest): AxiosPromise<any> {
  return axios({
    url: 'http://localhost:7002/api/v1/users/create',
    method: 'post',
    withCredentials: true,
    data: { ...req },
  });
}

export function useCreateUser(onError?: OnError, onSuccess?: OnSuccess) {
  return useMutation(createUser, {
    onError: onError,
    onSuccess: onSuccess,
  });
}

export function deleteUser(userId: string) {
  return axios({
    url: `http://localhost:7002/api/v1/users/${userId}/delete`,
    method: 'delete',
    withCredentials: true,
  });
}
