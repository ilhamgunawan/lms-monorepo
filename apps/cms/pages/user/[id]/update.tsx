import React from 'react';
import { GetServerSideProps } from 'next';
import NextHead from 'next/head';
import { getConfig, Config } from '../../../src/utils/utils';
import Layout from '../../../src/layout/Layout';
import RouteProtection from '../../../src/route-protection/RouteProtection';
import AuthProtection from '../../../src/auth-protection/AuthProtection';
import UpdateUserScreen from '../../../src/user-management/UpdateUserScreen';

interface PageProps {
  config: Config;
  id: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params;
  const id = params?.id ?? "";
  const config = getConfig();
  return {
    props: {
      config,
      id,
    },
  };
};

export default function Page(props: PageProps) {
  const id = props.id;

  return (
    <AuthProtection>
      <NextHead>
        <title>{`Update User - ${props.config.siteName}`}</title>
      </NextHead>
      <Layout breadcumbList={[
          {
            name: 'Users',
            href: '/user',
          },
          {
            name: 'Update User',
            href: null,
          }
        ]}>
        <RouteProtection allowedRoles={['admin', 'teacher']}>
          <UpdateUserScreen userId={id} />
        </RouteProtection>
      </Layout>
    </AuthProtection>
  );
};
