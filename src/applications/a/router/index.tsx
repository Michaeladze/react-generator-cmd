import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const A = lazy(() => import('../components/pages/A'));

export const routes: RouteObject[] = [
{
        path: 'a',
        element: <Suspense fallback=''><A/></Suspense>
    },
];

