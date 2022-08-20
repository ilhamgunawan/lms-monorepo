import { Box, Flex, Heading, Text, Button } from '@chakra-ui/react';
import { CloseIcon, RepeatIcon } from '@chakra-ui/icons';

interface Props {
  title: string;
  body: string;
  onRetry: () => void;
}

export default function GeneralErrorScreen(props: Props) {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg={'gray.600'}
          rounded={'50px'}
          w={'55px'}
          h={'55px'}
          textAlign="center">
          <CloseIcon boxSize={'20px'} color={'white'} />
        </Flex>
      </Box>
      <Heading as="h2" size="lg" mt={6} mb={2}>
        {props.title}
      </Heading>
      <Text color={'gray.500'} mb={4}>
        {props.body}
      </Text>
      <Button 
        onClick={() => props.onRetry()} 
        colorScheme='blackAlpha'
        variant='outline'
        leftIcon={<RepeatIcon />}
      >
        Retry
      </Button>
    </Box>
  );
}
