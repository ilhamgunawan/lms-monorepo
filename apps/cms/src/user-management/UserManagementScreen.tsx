import { useGetUsers } from '@lms-monorepo/util';
import GeneralErrorScreen from '../error/GeneralErrorScreen';
import UserTablePlaceHolder from './UserTablePlaceholder';
import UserTable from './UserTable';

export default function UserManagementScreen() {
  const {status, data: res, refetch} = useGetUsers();
  const users = res?.data.data.users;

  switch(status) {
    case 'idle':
      return <UserTablePlaceHolder />;
    case 'loading':
      return <UserTablePlaceHolder />;
    case 'success':
      return <UserTable users={users ? users : []} refetchUsers={refetch} />;
    case 'error':
      return <GeneralErrorScreen title="Something wen't wrong" body='Please try again' onRetry={refetch} />
    default:
      return <UserTablePlaceHolder />;
  }
}
