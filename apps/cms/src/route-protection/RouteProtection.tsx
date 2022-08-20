import React, { ReactNode, useReducer, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useToast } from '@chakra-ui/react';
import { ErrorResponse, CurrentRoleResponse } from '@lms-monorepo/types';
import { fetchCurrentRole } from '@lms-monorepo/util';
import { reducer, onStateChange, initialState, Protection } from './route-protection-reducer';
import LoadingScreen from '../loading/LoadingScreen';
import GeneralErrorScreen from '../error/GeneralErrorScreen';

type AllowedRoles = 
  | 'admin'
  | 'teacher'
  | 'student';

interface Props {
  children: ReactNode;
  allowedRoles: Array<AllowedRoles>;
}

function validateRoles(roles: Array<AllowedRoles>, currentRole: string): Protection {
  return roles.find(role => role === currentRole) ? 'ACCEPT' : 'DENY';
}

export default function RouteProtection(props: Props) {
  const router = useRouter();
  const toast = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);
  const currentRole = useMutation(fetchCurrentRole, {
    onError: (error: AxiosError<ErrorResponse>, _variables, _context) => {
      dispatch({
        type: 'FETCH_CURRENT_ROLE_ERROR',
        payload: {
          protection: 'UNDEFINED',
          error: {
            code: error.response ? error.response.data.code : '',
            message: error.response ? error.response.data.message : '',
          },
        },
      });
    },
    onSuccess: (res: AxiosResponse<CurrentRoleResponse>, _variables, _context) => {
      dispatch({
        type: 'FETCH_CURRENT_ROLE_SUCCESS',
        payload: {
          protection: validateRoles(props.allowedRoles, res.data.data.role.name),
          error: {
            code: '',
            message: '',
          },
        },
      });
    },
  });

  const reducerConfig = {
    currentRoleFetcher: () => currentRole.mutate(),
    router: router,
    useToast: toast,
  };

  useEffect(() => {
    onStateChange(state, dispatch, reducerConfig);
  }, [state.type]);

  switch(state.type) {
    case 'INITIAL':
      return <LoadingScreen />;
    case 'FETCHING_CURRENT_ROLE':
      return <LoadingScreen />;
    case 'FETCHING_CURRENT_ROLE_SUCCESS':
      switch(state.payload.protection) {
        case 'ACCEPT':
          return <>{props.children}</>;
        case 'DENY':
          return (
            <GeneralErrorScreen 
              title="Access Denied" 
              body="You don't have permission to access this page" 
              onRetry={() => {
                dispatch({
                  type: 'FETCH_CURRENT_ROLE',
                  payload: {
                    protection: 'UNDEFINED',
                    error: {
                      code: '',
                      message: '',
                    },
                  },
                });
              }} 
            />
          );
        case 'UNDEFINED':
          return (
            <GeneralErrorScreen 
              title="Access Denied" 
              body="You don't have permission to access this page" 
              onRetry={() => {
                dispatch({
                  type: 'FETCH_CURRENT_ROLE',
                  payload: {
                    protection: 'UNDEFINED',
                    error: {
                      code: '',
                      message: '',
                    },
                  },
                });
              }} 
            />
          );
        default: 
        return null;
      }
    case 'FETCHING_CURRENT_ROLE_ERROR':
      return (
        <GeneralErrorScreen 
          title="Something wen't wrong" 
          body='Please try again' 
          onRetry={() => {
            dispatch({
              type: 'FETCH_CURRENT_ROLE',
              payload: {
                protection: 'UNDEFINED',
                error: {
                  code: '',
                  message: '',
                },
              },
            });
          }} 
        />
      );
    default:
      return null;
  }
}
