module.exports = ({ ComponentName, routePath }) => {

  return `import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

const ${ComponentName} = lazy(() => import('../components/pages/${ComponentName}'));

export const routes: RouteObject[] = [
    {
        path: '${routePath}',
        element: <${ComponentName} />,
    }
];
`;
};
