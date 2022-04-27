import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const P = lazy(() => import('../components/pages/P'));

export const routes: RouteObject[] = [
{
        path: 'p',
        element: <Suspense fallback=''><P/></Suspense>
    },
];

