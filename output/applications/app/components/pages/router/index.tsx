import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const p = lazy(() => import('../components/pages/p'));

export const routes: RouteObject[] = [
    {
        path: '/p',
        element: <p />,
    }
];
