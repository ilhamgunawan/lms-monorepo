import { Dispatch } from 'react';
import { NextRouter } from 'next/router';
import { UseToastOptions } from '@chakra-ui/react';
import { ErrorResponse } from '@lms-monorepo/types';

export type StateType = 
  | 'INITIAL'
  | 'FETCHING_CURRENT_ROLE'
  | 'FETCHING_CURRENT_ROLE_SUCCESS'
  | 'FETCHING_CURRENT_ROLE_ERROR';

export type ActionType =
  | 'INITIALIZE'
  | 'FETCH_CURRENT_ROLE'
  | 'FETCH_CURRENT_ROLE_SUCCESS'
  | 'FETCH_CURRENT_ROLE_ERROR';

export type Protection = | 'UNDEFINED' | 'ACCEPT' | 'DENY';

export interface Payload {
  protection: Protection;
  error?: ErrorResponse;
}

export interface State {
  type: StateType;
  payload: Payload;
}

export interface Action {
  type: ActionType;
  payload: Payload;
}

export const initialState: State = {
  type: 'INITIAL',
  payload: {
    protection: 'UNDEFINED',
    error: {
      code: '',
      message: '',
    },
  },
};

export function reducer(state: State, action: Action): State {
  switch(action.type) {
    case 'INITIALIZE':
      return {
        type: 'INITIAL',
        payload: {
          protection: 'UNDEFINED',
          error: {
            code: '',
            message: '',
          },
        },
      };
    case 'FETCH_CURRENT_ROLE':
      return {
        ...state,
        type: 'FETCHING_CURRENT_ROLE',
      };
    case 'FETCH_CURRENT_ROLE_SUCCESS':
      return {
        type: 'FETCHING_CURRENT_ROLE_SUCCESS',
        payload: {
          protection: action.payload.protection,
          error: {
            code: '',
            message: '',
          },
        },
      };
    case 'FETCH_CURRENT_ROLE_ERROR':
      return {
        type: 'FETCHING_CURRENT_ROLE_ERROR',
        payload: {
          protection: action.payload.protection,
          error: action.payload.error,
        },
      };
    default:
      return state;
  }
}

export interface ReducerConfig {
  currentRoleFetcher: () => void;
  router: NextRouter;
  useToast: (option: UseToastOptions) => void;
}

export function onStateChange(state: State, dispatch: Dispatch<Action>, reducerConfig: ReducerConfig) {
  switch(state.type) {
    case 'INITIAL':
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
      break;
    case 'FETCHING_CURRENT_ROLE':
      reducerConfig.currentRoleFetcher();
      break;
    case 'FETCHING_CURRENT_ROLE_SUCCESS':
      break;
    case 'FETCHING_CURRENT_ROLE_ERROR':
      switch(state.payload.error?.code) {
        case '10001':
          window.localStorage.removeItem('menus');
          reducerConfig.router.replace('/auth/login');
          break;
        case '10002':
          window.localStorage.removeItem('menus');
          reducerConfig.router.replace('/auth/login');
          break;
        case '10003':
          window.localStorage.removeItem('menus');
          reducerConfig.router.replace('/auth/login');
          break;
        default:
          reducerConfig.useToast({
            status: 'error',
            title: state.payload.error?.message,
            position: 'top',
          });
          break;
      }
      break;
    default:
      break;
  }
}
