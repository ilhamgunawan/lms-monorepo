/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginRequest, LoginResponse , ValidateSessionResponse, ErrorResponse } from '@lms-monorepo/types';
import { fetchLogin, fetchValidateSession } from '@lms-monorepo/util';
import React, { useReducer, Dispatch } from 'react';
import { useMutation, UseMutationResult } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { useRouter } from 'next/router';
import {
  Flex,
  Stack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';
import LoadingScreen from '../loading/LoadingScreen';
import { 
  reducer, 
  initialState, 
  onStateChange,
  State,
  Action, 
} from './login-reducer';

interface ContentProps {
  state: State;
  dispatch: Dispatch<Action>;
  isDisabled: boolean;
  login: UseMutationResult<AxiosResponse<any, any>, unknown, LoginRequest, unknown>;
}

const Content = (props: ContentProps) => {
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <LoginHeader />
        <LoginForm 
          state={props.state} 
          dispatch={props.dispatch} 
          isDisabled={props.isDisabled}
          mutate={props.login} 
        />
      </Stack>
    </Flex>
  );
}

export default function LoginLayout() {
  const router = useRouter();
  const toast = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = useMutation(fetchLogin, {
    onError: (error: AxiosError<ErrorResponse>, _variables, _context) => {
      window.localStorage.removeItem('user');
      dispatch({
        type: 'FETCH_LOGIN_ERROR',
        payload: {
          error: error.response?.data.message,
        },
      });
    },
    onSuccess: (res: AxiosResponse<LoginResponse>, _variables, _context) => {
      window.localStorage.setItem('user', JSON.stringify(res.data.data));
      dispatch({
        type: 'FETCH_LOGIN_SUCCESS',
        payload: {
          error: '',
        },
      });
    },
  });

  const validateSession = useMutation(fetchValidateSession, {
    onError: (_error: AxiosError<ErrorResponse>, _variables, _context) => {
      window.localStorage.removeItem('user');
      dispatch({
        type: 'FORM_INQUIRY',
        payload: {
          login: initialState.login,
          error: initialState.error,
        },
      });
    },
    onSuccess: (_res: AxiosResponse<ValidateSessionResponse>, _variables, _context) => {
      router.replace('/');
    },
  });

  // const menus = useMutation(fetchMenus, {
  //   onError: (_error: AxiosError<ErrorResponse>, _variables, _context) => {
  //     dispatch({
  //       type: 'FETCH_MENUS_ERROR',
  //       payload: {
  //         error: initialState.error,
  //       },
  //     });
  //   },
  //   onSuccess: (res: AxiosResponse<FetchMenusResponse>, _variables, _context) => {
  //     dispatch({
  //       type: 'FETCH_MENUS_SUCCESS',
  //       payload: {
  //         menus: res.data.menus, 
  //         error: '',
  //       },
  //     });
  //   },
  // });

  const reducerConfig = {
    loginFetcher: (body: LoginRequest) => login.mutate(body),
    validateSessionFetcher: () => validateSession.mutate(),
    // menusFetcher: () => menus.mutate(),
    useToast: toast,
    router: router,
  };

  React.useEffect(() => {
    onStateChange(
      state, 
      dispatch,
      reducerConfig,
    );

    /**
     * State logging for development purpose
     */
    // console.log("state: ", state);

  }, [state.type]);

  return (
    <>
      {state.type === 'INITIAL' && <LoadingScreen />}
      {state.type === 'VALIDATING_SESSION' && <LoadingScreen />}
      {state.type === 'FORM_INQUIRING' && 
        <Content 
          state={state}
          dispatch={dispatch}
          isDisabled={false}
          login={login}
        />
      }
      {state.type === 'FETCHING_LOGIN' && 
        <Content 
          state={state}
          dispatch={dispatch}
          isDisabled={true}
          login={login}
        />
      }
      {state.type === 'FETCHING_LOGIN_SUCCESS' && 
        <Content 
          state={state}
          dispatch={dispatch}
          isDisabled={true}
          login={login}
        />
      }
      {state.type === 'FETCHING_LOGIN_ERROR' && 
        <Content 
          state={state}
          dispatch={dispatch}
          isDisabled={false}
          login={login}
        />
      }
      {state.type === 'FETCHING_MENUS' && 
        <Content 
          state={state}
          dispatch={dispatch}
          isDisabled={true}
          login={login}
        />
      }
      {state.type === 'FETCHING_MENUS_SUCCESS' && 
        <Content 
          state={state}
          dispatch={dispatch}
          isDisabled={true}
          login={login}
        />
      }
      {state.type === 'FETCHING_MENUS_ERROR' && 
        <Content 
          state={state}
          dispatch={dispatch}
          isDisabled={false}
          login={login}
        />
      }
    </>
  );
}
