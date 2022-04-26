const routerTemplate = () => {
  return `import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';


export const routes: RouteObject[] = [
];

`
};

module.exports = {
  routerTemplate
}
