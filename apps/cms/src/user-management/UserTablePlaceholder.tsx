import { 
  Box, 
  Skeleton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
} from '@chakra-ui/react';

import { PlusSquareIcon } from '@chakra-ui/icons'

export default function UserTablePlaceHolder() {
  return (
    <Box>
      <Button 
        leftIcon={<PlusSquareIcon />} 
        colorScheme='blackAlpha' 
        marginBottom='4'
        isDisabled={true}
      >
        Create User
      </Button>
      <Box boxShadow='md' padding='2' bg='white' borderRadius='lg'>
        <TableContainer>
          <Table variant='simple' colorScheme='gray'>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td><Skeleton height='20px' /></Td>
                <Td><Skeleton height='20px' /></Td>
              </Tr>
              <Tr>
                <Td><Skeleton height='20px' /></Td>
                <Td><Skeleton height='20px' /></Td>
              </Tr>
              <Tr>
                <Td><Skeleton height='20px' /></Td>
                <Td><Skeleton height='20px' /></Td>
              </Tr>
              <Tr>
                <Td><Skeleton height='20px' /></Td>
                <Td><Skeleton height='20px' /></Td>
              </Tr>
              <Tr>
                <Td><Skeleton height='20px' /></Td>
                <Td><Skeleton height='20px' /></Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
