/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, Dispatch, ChangeEvent } from 'react';
import { UseMutationResult } from 'react-query';
import { AxiosResponse } from 'axios';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { State, Action } from './login-reducer';
import { LoginRequest } from '@lms-monorepo/types';

interface LoginFormProps {
  state: State;
  dispatch: Dispatch<Action>;
  isDisabled: boolean;
  mutate: UseMutationResult<AxiosResponse<any, any>, unknown, LoginRequest, unknown>;
}

export default function LoginForm(props: LoginFormProps) {
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    props.dispatch({
      type: 'FETCH_LOGIN',
      payload: {
        error: '',
      },
    });
  }

  function handleChangeEmail(e: ChangeEvent<HTMLInputElement>) {
    props.dispatch({
      type: 'FORM_INQUIRY',
      payload: {
        login: {
          email: e.target.value,
          password: props.state.login?.password
            ? props.state.login?.password
            : '',
        },
      },
    });
  }

  function handleChangePassword(e: ChangeEvent<HTMLInputElement>) {
    props.dispatch({
      type: 'FORM_INQUIRY',
      payload: {
        login: {
          email: props.state.login?.email ? props.state.login?.email : '',
          password: e.target.value,
        },
      },
    });
  }

  return (
    <Box
      rounded={'lg'}
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={'lg'}
      p={8}
    >
      <Stack spacing={4} as='form' onSubmit={onSubmit}>
        <FormControl id='email'>
          <FormLabel>Email address</FormLabel>
          <Input
            type='email'
            isDisabled={props.isDisabled}
            isRequired={true}
            value={props.state.login?.email}
            onChange={handleChangeEmail}
          />
        </FormControl>
        <FormControl id='password'>
          <FormLabel>Password</FormLabel>
          <Input
            type='password'
            isDisabled={props.isDisabled}
            isRequired={true}
            value={props.state.login?.password}
            onChange={handleChangePassword}
          />
        </FormControl>
        <Stack spacing={10}>
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
            type='submit'
            isLoading={props.isDisabled}
          >
            Sign in
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
