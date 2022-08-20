import { ErrorResponse } from '@lms-monorepo/types';

import React from 'react';
import { SettingsIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Menu,
  MenuButton,
  HStack,
  Avatar,
  MenuList,
  MenuGroup,
  MenuDivider,
  MenuItem,
  Text,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { FaPowerOff } from 'react-icons/fa';
import { fetchLogout } from '@lms-monorepo/util';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';

type Props = {
  name: string;
  avatarUrl: string;
};

export default function MenuDropdown({ name, avatarUrl }: Props) {
  const router = useRouter();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const logout = useMutation(fetchLogout, {
    onError: (error: AxiosError<ErrorResponse>, _variables, _context) => {
      toast({
        status: 'error',
        title: error.response?.data.message,
        position: 'top',
      });
    },
    onSuccess: (_res, _variables, _context) => {
      window.localStorage.removeItem('menus');
      router.replace('/auth/login');
    },
  });

  function handleLogout() {
    onClose();
    logout.mutate();
  }

  return (
    <Menu>
      <MenuButton transition='all 0.3s' _focus={{ boxShadow: 'none' }}>
        <HStack>
          <Avatar size='sm' name={name} src={avatarUrl} />
        </HStack>
      </MenuButton>
      <MenuList maxWidth='200px'>
        <MenuGroup>
          <Text paddingX='4' fontWeight='semibold'>
            {name}
          </Text>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <MenuItem icon={<FaPowerOff />} onClick={() => onOpen()}>
            Log out
          </MenuItem>
        </MenuGroup>
      </MenuList>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef.current}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Log out
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure want to log out?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef.current} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='blue' onClick={() => handleLogout()} ml={3}>
                Yes, log out
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Menu>
  );
}
