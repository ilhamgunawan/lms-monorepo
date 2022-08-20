import { Dispatch } from 'react';
import { NextRouter } from 'next/router';
import { UseToastOptions } from '@chakra-ui/react';
import { LoginRequest } from '@lms-monorepo/types';
import menuJson from '../constant/menus.json';

export interface Menu {
  id: string;
  name: string;
  parent_id: string | null;
  path: string | null;
  roles: Array<string>;
}

export type StateType = 
  | 'INITIAL' 
  | 'VALIDATING_SESSION' 
  | 'FORM_INQUIRING' 
  | 'FETCHING_LOGIN' 
  | 'FETCHING_LOGIN_SUCCESS' 
  | 'FETCHING_LOGIN_ERROR'
  | 'FETCHING_MENUS'
  | 'FETCHING_MENUS_SUCCESS'
  | 'FETCHING_MENUS_ERROR';

export interface State {
  type: StateType;
  login?: LoginRequest;
  menus?: Array<Menu>;
  error?: string;
}

export type ActionType = 
  | 'INITIALIZE'
  | 'VALIDATE_SESSION'
  | 'FORM_INQUIRY'
  | 'FETCH_LOGIN'
  | 'FETCH_LOGIN_SUCCESS'
  | 'FETCH_LOGIN_ERROR'
  | 'FETCH_MENUS'
  | 'FETCH_MENUS_SUCCESS'
  | 'FETCH_MENUS_ERROR';

export interface ActionPayload {
  login?: LoginRequest;
  menus?: Array<Menu>;
  error?: string;
}

export interface Action {
  type: ActionType;
  payload: ActionPayload;
}

export const initialState: State = {
  type: 'INITIAL',
  login: {
    email: '',
    password: '',
  },
  error: ''
};

export function reducer(state: State, action: Action): State {
  /**
   * Action logging for development purpose
   */
  // console.log('action: ', action);

  switch(action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        type: 'INITIAL',
      };
    case 'VALIDATE_SESSION':
      return {
        ...state,
        type: 'VALIDATING_SESSION',
      };
    case 'FORM_INQUIRY':
      return {
        type: 'FORM_INQUIRING',
        login: action.payload.login,
        error: '',
      };
    case 'FETCH_LOGIN':
      return {
        ...state,
        type: 'FETCHING_LOGIN',
        error: '',
      };
    case 'FETCH_LOGIN_SUCCESS':
      return {
        ...state,
        type: 'FETCHING_LOGIN_SUCCESS',
        error: '',
      };
    case 'FETCH_LOGIN_ERROR':
      return {
        ...state,
        type: 'FETCHING_LOGIN_ERROR',
        error: action.payload.error,
      };
    case 'FETCH_MENUS':
      return {
        ...state,
        type: 'FETCHING_MENUS',
        error: '',
      };
    case 'FETCH_MENUS_SUCCESS':
      return {
        ...state,
        type: 'FETCHING_MENUS_SUCCESS',
        menus: action.payload.menus,
        error: '',
      };
    case 'FETCH_MENUS_ERROR':
      return {
        ...state,
        type: 'FETCHING_MENUS_ERROR',
        error: action.payload.error,
      };
    default:
      return state;
  }
};

interface ReducerConfig {
  loginFetcher: (body: LoginRequest) => void;
  validateSessionFetcher: () => void;
  // menusFetcher: () => void;
  useToast: (options: UseToastOptions) => void;
  router: NextRouter;
}

export function onStateChange(
  state: State, 
  dispatch: Dispatch<Action>,
  reducerConfig: ReducerConfig,
) {
  switch(state.type) {
    case 'INITIAL':
      dispatch({
        type: 'VALIDATE_SESSION',
        payload: {
          login: initialState.login,
          error: initialState.error,
        },
      });
      break;
    case 'VALIDATING_SESSION':
      reducerConfig.validateSessionFetcher();
      break;
    case 'FETCHING_LOGIN':
      reducerConfig.loginFetcher({
        email: state.login?.email ? state.login.email : '', 
        password: state.login?.password ? state.login.password : '' 
      });
      break;
    case 'FORM_INQUIRING':
      break;
    case 'FETCHING_LOGIN_SUCCESS':
      dispatch({
        type: 'FETCH_MENUS',
        payload: { 
          error: '', 
        },
      });
      dispatch({
        type: 'FETCH_MENUS_SUCCESS',
        payload: {
          menus: menuJson,
          error: '',
        }
      })
      break;
    case 'FETCHING_LOGIN_ERROR':
      reducerConfig.useToast({
        status: 'error',
        title: state.error,
        position: 'top',
      });
      break;
    // case 'FETCHING_MENUS':
    //   reducerConfig.menusFetcher();
    //   break;
    case 'FETCHING_MENUS_SUCCESS':
      window.localStorage.setItem('menus', JSON.stringify(state.menus));
      reducerConfig.router.replace('/');
      break;
    case 'FETCHING_MENUS_ERROR':
      reducerConfig.useToast({
        status: 'error',
        title: state.error,
        position: 'top',
      });
      break;
    default:
      break;
  }
}
