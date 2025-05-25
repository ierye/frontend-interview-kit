import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo/client';
import { Outlet } from 'react-router-dom';

export const Root: React.FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <Outlet />
    </ApolloProvider>
  );
};