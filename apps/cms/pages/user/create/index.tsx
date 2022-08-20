import React from 'react';
import { GetServerSideProps } from 'next';
import NextHead from 'next/head';
import { getConfig, Config } from '../../../src/utils/utils';
import Layout from '../../../src/layout/Layout';
import RouteProtection from '../../../src/route-protection/RouteProtection';
import AuthProtection from '../../../src/auth-protection/AuthProtection';
import CreateUserScreen from '../../../src/user-management/CreateUserScreen';

interface PageProps {
  config: Config;
};

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const config = getConfig();
  return {
    props: {
      config,
    },
  };
};

export default function Page(props: PageProps) {
  return (
    <AuthProtection>
      <NextHead>
        <title>{`Create User - ${props.config.siteName}`}</title>
      </NextHead>
      <Layout breadcumbList={[
          {
            name: 'Users',
            href: '/user',
          },
          {
            name: 'Create User',
            href: null,
          }
        ]}>
        <RouteProtection allowedRoles={['admin', 'teacher']}>
          <CreateUserScreen />
        </RouteProtection>
      </Layout>
    </AuthProtection>
  );
};
