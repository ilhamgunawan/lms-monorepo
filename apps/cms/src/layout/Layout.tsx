import { BreadcrumbItem, LoginData } from '@lms-monorepo/types';

import { ReactNode, useState, useEffect } from 'react';
import {
  Flex,
  Badge,
  Box,
  Heading,
  Container,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import Breadcrumb from "../breadcrumb/Breadcrumb";
import MenuDropdown from './MenuDropdown';

type Props = {
  breadcumbList?: Array<BreadcrumbItem>,
  children: ReactNode,
};

export default function Layout({breadcumbList, children}: Props) {
  const [userJson, setUserData] = useState<string | null>(null);
  const user: LoginData | null = userJson 
    ? JSON.parse(userJson)
    : null
  ;
  const name = user ? user.name : '';
  const avatarUrl = 'someAvatarUrl';
  const role = user ? user.role.name : '';

  useEffect(() => {
    if (window) {
      setUserData(window.localStorage.getItem('user'));
    }
  }, []);

  return (
    <Box bg='blackAlpha.50' minHeight='100vh'>
      <Box as='nav' bg='white' borderBottom='1px' borderBottomColor='blackAlpha.200'>
        <Container maxWidth='1248px' paddingY='3'>
          <Flex flexDirection='row' justifyContent='space-between'>
            <Box>
              <Wrap align='center' marginBottom='0.5'>
                <WrapItem>
                  <Heading as='h1' fontSize='xl'>LMS</Heading>
                </WrapItem>
                <WrapItem>
                  <Badge>{role}</Badge>
                </WrapItem>
              </Wrap>
              <Breadcrumb items={breadcumbList} />
            </Box>
            <MenuDropdown 
              name={name}
              avatarUrl={avatarUrl}
            />
          </Flex>
        </Container>
      </Box>
      <Container as='main' maxWidth='1248px' marginTop='5'>{children}</Container>
    </Box>
  );
}
