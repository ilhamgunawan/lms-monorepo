import React from 'react';
import { GetServerSideProps } from 'next';
import NextHead from 'next/head';
import { getConfig, Config } from '../../src/utils/utils';
import Layout from '../../src/layout/Layout';
import RouteProtection from '../../src/route-protection/RouteProtection';
import AuthProtection from '../../src/auth-protection/AuthProtection';
import UserManagementScreen from '../../src/user-management/UserManagementScreen';

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

const Page = (props: PageProps) => {
  return (
    <AuthProtection>
      <NextHead>
        <title>{`Users - ${props.config.siteName}`}</title>
      </NextHead>
      <Layout breadcumbList={[{ name: 'Users', href: null}]}>
        <RouteProtection allowedRoles={['admin', 'teacher']}>
          <UserManagementScreen />
        </RouteProtection>
      </Layout>
    </AuthProtection>
  );
};

export default Page;
