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
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import { fetchUserById } from '@lms-monorepo/util';

interface Props {
  userId: string;
}

interface User {
  userId: string;
  name: string;
  email: string;
  roles: Array<any>;
}

interface UserUpdateContext {
  user: User;
}

type UserUpdateEvent =
  | { type: 'FETCH_INITIAL_DATA', user?: User }
  | { type: 'FETCH_INITIAL_DATA_SUCCESS', user: User }
  | { type: 'FETCH_INITIAL_DATA_ERROR', user?: User }
  | { type: 'UPDATE_FORM', user: User }
  | { type: 'VALIDATE_DATA', user: User }
  | { type: 'VALIDATE_DATA_SUCCESS', user: User }
  | { type: 'VALIDATE_DATA_ERROR', user?: User }
  | { type: 'SUBMIT_DATA_SUCCESS', user?: User }
  | { type: 'SUBMIT_DATA_ERROR', user?: User };

type UserUpdateState =
  | { value: 'idle', context: UserUpdateContext }
  | { value: 'fetchingInitialData', context: UserUpdateContext }
  | { value: 'fetchingInitialDataError', context: UserUpdateContext }
  | { value: 'formInquiring', context: UserUpdateContext }
  | { value: 'validatingData', context: UserUpdateContext }
  | { value: 'submittingData', context: UserUpdateContext }
  | { value: 'submittingDataError', context: UserUpdateContext }
  | { value: 'submittingDataSuccess', context: UserUpdateContext };

const machine = createMachine<UserUpdateContext, UserUpdateEvent, UserUpdateState>(
  {
    id: "updateUser",
    initial: "idle",
    states: {
      idle: {
        entry: ['getUserById'],
        on: {
          FETCH_INITIAL_DATA: { target: "fetchingInitialData" },
        },
      },
      fetchingInitialData: {
        on: {
          FETCH_INITIAL_DATA_SUCCESS: { target: "formInquiring", actions: ['setUserData'] },
          FETCH_INITIAL_DATA_ERROR: { target: "fetchingInitialDataError" },
        },
      },
      fetchingInitialDataError: {
        on: {
          FETCH_INITIAL_DATA: { target: "fetchingInitialData" },
        },
      },
      formInquiring: {
        on: {
          UPDATE_FORM: { target: "formInquiring", actions: ['setUserData'] },
          VALIDATE_DATA: { target: "validatingData" },
        },
      },
      validatingData: {
        on: {
          VALIDATE_DATA_SUCCESS: { target: "submittingData" },
          VALIDATE_DATA_ERROR: { target: "formInquiring" },
        },
      },
      submittingData: {
        on: {
          SUBMIT_DATA_SUCCESS: { target: "submittingDataSuccess" },
          SUBMIT_DATA_ERROR: { target: "submittingDataError" },
        },
      },
      submittingDataError: {},
      submittingDataSuccess: {
        type: "final",
      },
    },
  },
);

export default function UpdateUserScreen({userId}: Props) {
  const [state, send] = useMachine(machine, { 
    actions: {
      setUserData: assign({
        user: (context, event) => {
          return event.user;
        }
      }),
      getUserById: (context, event) => {
        send({type: 'FETCH_INITIAL_DATA'});
        fetchUserById(userId)
          .then(res => {
            const { id, name, email, roles } = res.data.data.user;
            send({
              type: 'FETCH_INITIAL_DATA_SUCCESS', 
              user: {
                userId: id,
                name: name,
                email: email,
                roles: roles,
              },
            });
          })
          .catch(e => send({type: 'FETCH_INITIAL_DATA_ERROR'}));
      },
    },
  });
  const stateTypes = state.value;
  const context = state.context;

  const isFormEnabled = Boolean(stateTypes === 'formInquiring');

  React.useEffect(() => {
    // onStateChange(stateTypes, userId);
    console.log({stateTypes});
    console.log({context});
  }, [stateTypes, context]);

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
      {/* {isSubmitError && (
        <Alert status='warning'>
          <AlertIcon />
          Something went wrong, please try again.
        </Alert>
      )} */}
      <FormControl id='form-user-name' isRequired>
        <FormLabel>Full name</FormLabel>
        <Input
          placeholder='Full name'
          _placeholder={{ color: 'gray.500' }}
          type='text'
          isDisabled={!isFormEnabled}
          value={context.user?.name}
          onChange={(event) => {
            send({
              type: 'UPDATE_FORM', 
              user: {
                userId: context.user?.userId,
                name: event.target.value,
                email: context.user?.email,
                roles: context.user?.roles,
              },
            });
          }}
        />
        {/* {isNameInvalid && (
          <Text color='red' fontSize='small'>
            Name cannot be empty
          </Text>
        )} */}
      </FormControl>
      <FormControl id='form-user-email'>
        <FormLabel>Email address</FormLabel>
        <Input
          placeholder='your-email@example.com'
          _placeholder={{ color: 'gray.500' }}
          type='email'
          defaultValue={context.user?.email}
          disabled={true}
        />
      </FormControl>
      <FormControl id='form-user-role' isRequired>
        <FormLabel>Roles</FormLabel>
        <Select
          placeholder='Select role'
          // isDisabled={isFormDisabled}
          // value={role}
          onChange={(event) => {
            // send('INPUT', { role: event.target.value });
          }}
        >
          <option value='admin'>Admin</option>
          <option value='teacher'>Teacher</option>
          <option value='student'>Student</option>
        </Select>
        {/* {isRoleInvalid && (
          <Text color='red' fontSize='small'>
            Role cannot be empty
          </Text>
        )} */}
      </FormControl>
      <Stack spacing={6} direction={['column', 'row']}>
        <Button
          bg={'blue.400'}
          color={'white'}
          w='full'
          _hover={{
            bg: 'blue.500',
          }}
          // isLoading={isFormDisabled}
          // onClick={() => send('VALIDATE')}
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  )
}