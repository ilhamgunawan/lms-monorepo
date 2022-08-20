import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ErrorResponse, ValidateSessionResponse } from '@lms-monorepo/types';
import { fetchValidateSession } from '@lms-monorepo/util';
import LoadingScreen from '../loading/LoadingScreen';
import GeneralErrorScreen from '../error/GeneralErrorScreen';

interface Props {
  children: ReactNode;
}

interface State {
  status: 'IDLE' | 'FETCHING' | 'SUCCESS' | 'ERROR';
  session: 'UNDEFINED' | 'VALID' | 'INVALID';
}

const initialState: State = {
  status: 'IDLE',
  session: 'UNDEFINED',
};

export default function AuthProtection(props: Props) {
  const router = useRouter();
  const [state, setState] = React.useState(initialState);
  const validateSession = useMutation(fetchValidateSession, {
    onError: (error: AxiosError<ErrorResponse>, _variables, _context) => {
      setState({
        status: 'ERROR',
        session: 'INVALID',
      });
      router.replace('/auth/login');
    },
    onSuccess: (_res: AxiosResponse<ValidateSessionResponse>, _variables, _context) => {
      setState({
        status: 'SUCCESS',
        session: 'VALID',
      });
    },
  });

  React.useEffect(() => {
    validateSession.mutate();
  }, []);

  switch(state.status) {
    case 'IDLE':
      return <LoadingScreen />;
    case 'FETCHING':
      return <LoadingScreen />;
    case 'SUCCESS':
      switch(state.session) {
        case 'VALID':
          return <>{props.children}</>;
        default:
          return null;
      }
    case 'ERROR':
      return (
        <GeneralErrorScreen 
          title="Something wen't wrong" 
          body='Please try again' 
          onRetry={() => validateSession.mutate()} 
        />
      );
    default:
      return null;
  }
}
