import { Spinner, Flex, Stack, useColorModeValue } from '@chakra-ui/react';

export default function LoadingScreen() {
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Spinner />
      </Stack>
    </Flex>
  );
}
