import React from "react";
import { Grid, GridItem, Avatar, Flex, Text, CSSObject, useMediaQuery } from '@chakra-ui/react';
import Link from "next/link";

type Menu = {
  id: string,
  name: string,
  url: string,
  description: string,
  icon: JSX.Element,
}

type Props = {
  menus: Array<Menu>
}

const menuHoverStyle: CSSObject = {
  boxShadow: 'sm',
  borderColor: 'blackAlpha.100',
}

const getTemplateColumns = (isTablet: boolean, isDesktop: boolean) => {
  if (isDesktop) {
    return 'repeat(3, 1fr)';
  } else if (isTablet) {
    return 'repeat(2, 1fr)';
  } else {
    return 'repeat(1, 1fr)';
  }
}

export default function DashboardAdmin({menus}: Props) {
  const [isTablet] = useMediaQuery('(min-width: 768px)');
  const [isDesktop] = useMediaQuery('(min-width: 1024px)');

  return (
    <Grid 
      bg='white' 
      padding='4' 
      shadow='sm' 
      borderRadius='md'
      templateColumns={getTemplateColumns(isTablet, isDesktop)}
    >
      {menus.map(({id, name, description, url, icon}) => 
        <GridItem key={id}>
          <Link href={url} passHref>
            <Flex 
              as='a'
              border='1px'
              borderColor='transparent'
              borderRadius='md'
              padding='3'
              alignItems='center'
              transition='0.15s'
              _hover={menuHoverStyle}
            >
                <Avatar icon={icon} bg='blackAlpha.200' />
                <Flex direction='column' marginLeft='3'>
                  <Text fontSize='md' fontWeight='semibold' color='blue.500'>{name}</Text>
                  <Text fontSize='smaller' color='blackAlpha.700'>{description}</Text>
                </Flex>
            </Flex>
          </Link>
        </GridItem>
      )}
    </Grid>
  );
}
