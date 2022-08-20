import React from 'react';
import { useRouter, NextRouter } from 'next/router';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Select,
  useColorModeValue,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

import { AxiosPromise, AxiosResponse } from 'axios';
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import {
  CreateUserRequest,
  CreateUserResponse,
} from '@lms-monorepo/types';
import { createUser } from '@lms-monorepo/util';

type CreateUserContext = {
  request: {
    name: string;
    email: string;
    role: string;
  };
  response: {
    data: any;
    message: string;
    status: string;
  };
  validation: Array<string>;
  router: NextRouter;
  createUser: (req: CreateUserRequest) => AxiosPromise<any>;
};

function makeMachine(
  router: NextRouter,
  createUser: (req: CreateUserRequest) => AxiosPromise<any>
) {
  return createMachine(
    {
      id: 'createUserForm',
      initial: 'idle',
      schema: {
        context: {} as CreateUserContext,
      },
      context: {
        request: {
          name: '',
          email: '',
          role: '',
        },
        response: {
          data: '',
          message: '',
          status: '',
        },
        validation: [],
        router,
        createUser,
      },
      states: {
        idle: {
          on: {
            INPUT: { target: 'idle', actions: 'inputForm' },
            VALIDATE: { target: 'validating', actions: 'updateValidation' },
          },
        },
        validating: {
          invoke: {
            src: 'calculateValidation',
          },
          on: {
            VALID: { target: 'submitting' },
            INVALID: { target: 'idle' },
          },
        },
        submitting: {
          invoke: {
            src: 'postData',
          },
          on: {
            OK: { target: 'succeed' },
            ERROR: { target: 'idle', actions: 'updateError' },
          },
        },
        succeed: {
          invoke: {
            src: 'redirectToSource',
          },
          type: 'final',
        },
      },
    },
    {
      actions: {
        inputForm: assign({
          request: (context, event) => {
            return {
              ...context.request,
              ...event,
            };
          },
          response: (context, event) => {
            return {
              data: '',
              message: '',
              status: '',
            };
          },
        }),
        updateValidation: assign({
          validation: (context, event) => {
            let validation: Array<string> = [];
            const { name, email, role } = context.request;
            if (name === '') {
              validation = [...validation, 'EMPTYNAME'];
            }
            if (email === '') {
              validation = [...validation, 'EMPTYEMAIL'];
            }
            if (role === '') {
              validation = [...validation, 'EMPTYROLE'];
            }
            return [...validation];
          },
        }),
        updateError: assign({
          response: (context, event) => {
            return {
              data: '',
              message: 'Error',
              status: 'Error',
            };
          },
        }),
      },
      services: {
        calculateValidation:
          (context, event, { src }) =>
          (send) => {
            if (context.validation.length === 0) send('VALID');
            send('INVALID');
          },
        postData:
          (context, event, { src }) =>
          async (send) => {
            context
              .createUser({ ...context.request })
              .then((_res: AxiosResponse<CreateUserResponse>) => {
                send('OK');
              })
              .catch((_err) => {
                send('ERROR');
              });
          },
        redirectToSource:
          (context, event, { src }) =>
          (send) => {
            context.router.replace('/user');
          },
      },
    }
  );
}

export default function UserForm(): JSX.Element {
  const router = useRouter();
  const machine = React.useCallback(() => {
    return makeMachine(router, createUser);
  }, []);
  const [state, send] = useMachine(machine);
  const { name, email, role } = state.context.request;
  const isFormDisabled =
    state.value === 'validating' ||
    state.value === 'submitting' ||
    state.value === 'succeed';
  const isNameInvalid = Boolean(
    state.context.validation.find((err) => err === 'EMPTYNAME')
  );
  const isEmailInvalid = Boolean(
    state.context.validation.find((err) => err === 'EMPTYEMAIL')
  );
  const isRoleInvalid = Boolean(
    state.context.validation.find((err) => err === 'EMPTYROLE')
  );
  const isSubmitError = state.context.response.status === 'Error';

  return (
    <Stack
      spacing={4}
      w={'full'}
      maxW={'md'}
      bg={useColorModeValue('white', 'gray.700')}
      rounded={'md'}
      boxShadow={'sm'}
      marginTop='4'
      marginX='auto'
      p={6}
    >
      {isSubmitError && (
        <Alert status='warning'>
          <AlertIcon />
          Something went wrong, please try again.
        </Alert>
      )}
      <FormControl id='form-user-name' isRequired>
        <FormLabel>Full name</FormLabel>
        <Input
          placeholder='Full name'
          _placeholder={{ color: 'gray.500' }}
          type='text'
          isDisabled={isFormDisabled}
          value={name}
          onChange={(event) => {
            send('INPUT', { name: event.target.value });
          }}
        />
        {isNameInvalid && (
          <Text color='red' fontSize='small'>
            Name cannot be empty
          </Text>
        )}
      </FormControl>
      <FormControl id='form-user-email' isRequired>
        <FormLabel>Email address</FormLabel>
        <Input
          placeholder='your-email@example.com'
          _placeholder={{ color: 'gray.500' }}
          type='email'
          isDisabled={isFormDisabled}
          value={email}
          onChange={(event) => {
            send('INPUT', { email: event.target.value });
          }}
        />
        {isEmailInvalid && (
          <Text color='red' fontSize='small'>
            Email cannot be empty
          </Text>
        )}
      </FormControl>
      <FormControl id='form-user-role' isRequired>
        <FormLabel>Default role</FormLabel>
        <Select
          placeholder='Select role'
          isDisabled={isFormDisabled}
          value={role}
          onChange={(event) => {
            send('INPUT', { role: event.target.value });
          }}
        >
          <option value='admin'>Admin</option>
          <option value='teacher'>Teacher</option>
          <option value='student'>Student</option>
        </Select>
        {isRoleInvalid && (
          <Text color='red' fontSize='small'>
            Role cannot be empty
          </Text>
        )}
      </FormControl>
      <Stack spacing={6} direction={['column', 'row']}>
        <Button
          bg={'blue.400'}
          color={'white'}
          w='full'
          _hover={{
            bg: 'blue.500',
          }}
          isLoading={isFormDisabled}
          onClick={() => send('VALIDATE')}
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  );
}
