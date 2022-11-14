module.exports = ({ ComponentName }) => {

  return `import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const ${ComponentName} = lazy(() => import('../pages/${ComponentName}'));

export const routes: RouteObject[] = [
    {
        path: '',
        element: <${ComponentName} />,
    }
];
`;
};
