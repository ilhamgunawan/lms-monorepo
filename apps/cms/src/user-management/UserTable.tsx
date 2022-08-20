import { User } from '@lms-monorepo/types';
import React from 'react';
import { 
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Text,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import { PlusSquareIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { deleteUser } from '@lms-monorepo/util';
import Link from 'next/link';
import { useMutation } from 'react-query';

interface Props {
  users: Array<User>;
  refetchUsers: () => void;
}

export default function UserTable(props: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [userToDelete, setUserToDelete] = React.useState({ id: '', name: ''});

  const delUser = useMutation(deleteUser, {
    onError: (_error, _variables, _context) => {
      onClose();
      props.refetchUsers();
    },
    onSuccess: (_res, _variables, _context) => {
      onClose();
      props.refetchUsers();
    },
  });

  function handleModalDelete({id, name}: {id: string, name: string}) {
    setUserToDelete({id, name});
    onOpen();
  }

  return (
    <Box marginTop='4'>
      <Link href='/user/create' passHref>
        <Button 
          leftIcon={<PlusSquareIcon />} 
          colorScheme='blue' 
          marginBottom='4'
        >
          Create User
        </Button>
      </Link>
      <Box boxShadow='sm' padding='2' bg='white' borderRadius='md'>
        <TableContainer>
          <Table variant='simple' colorScheme='gray'>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {props.users.map(user => {
                return(
                  <Tr key={user.id}>
                    <Td><Text>{user.name}</Text></Td>
                    <Td><Text>{user.email}</Text></Td>
                    <Td>
                      <Flex>
                        <Link href={`/user/${user.id}/update`} passHref>
                          <Button variant='ghost'><EditIcon /></Button>
                        </Link>
                        <Button variant='ghost' onClick={() => handleModalDelete({id: user.id, name: user.name})}><DeleteIcon /></Button>
                      </Flex>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef.current}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete user
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure want to delete user <Text display='inline-block' fontWeight='bold'>{userToDelete.name}</Text>?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef.current} onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  colorScheme='red' 
                  onClick={() => delUser.mutate(userToDelete.id)} 
                  ml={3}
                  isLoading={delUser.isLoading}
                  isDisabled={delUser.isLoading}
                >
                  Yes, delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Box>
  );
}
