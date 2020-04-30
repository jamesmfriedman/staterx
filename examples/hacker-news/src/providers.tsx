import React from 'react';
import { Router } from 'react-router-dom';
import { history } from '@common/history';

export function Providers({ children }: { children: React.ReactNode }) {
  return <Router history={history}>{children}</Router>;
}
