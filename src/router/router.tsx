import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const Xer = lazy(() => import('../components/pages/Xer'));

export const routes: RouteObject[] = [
{
        path: 'p',
        element: <Suspense fallback=''><Xer/></Suspense>
    },
];

