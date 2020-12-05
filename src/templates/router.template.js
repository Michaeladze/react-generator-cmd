const routerConfigTemplate = () => {
  return `import React, { ComponentType, lazy, LazyExoticComponent, ReactNode } from 'react';

/** Везде, где подключается <Router routes={routes}/>, кроме App.tsx, routes: IRoute[] берется из пропсов IProps. */

export interface IRoute {
  path: string;
  exact: boolean;
  private?: boolean;
  component?: LazyExoticComponent<ComponentType<any>>;
  routes?: IRoute[];
  redirect?: string;
  fallback: NonNullable<ReactNode> | null;
}

export const routes = [];
`
}

const routerTemplate = () => {
  return `import React from 'react';
import { Switch } from 'react-router-dom';
import RouteWithSubRoutes from './RouteWithSubRoutes';
import { IRoute } from './config';

interface IProps {
  routes: IRoute[];
}

const Router: React.FC<IProps> = ({ routes }: IProps) => {
  return <Switch>{routes && routes.map((route: IRoute) => <RouteWithSubRoutes key={route.path} {...route} />)}</Switch>;
};

export default Router;
`
}

const routerWithSubRoutesTemplate = () => {
  return `import React, { Suspense } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IRoute } from './config';

const RouteWithSubRoutes = (route: IRoute) => {
  const authenticated: boolean = true;

  const renderRoute = (route: IRoute, props: any) => {
    if (route.redirect) return <Redirect to={route.redirect} />;

    if ((route.private && authenticated) || !route.private) {
      return route.component && <route.component {...props} routes={route.routes} />;
    }

    return <div>Redirect Here When Not Authenticated</div>;
  };

  return (
    <Suspense fallback={route.fallback}>
      <Route path={route.path} render={(props: any) => renderRoute(route, props)} />
    </Suspense>
  );
};

export default RouteWithSubRoutes;
`
}

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  routerConfigTemplate, routerTemplate, routerWithSubRoutesTemplate
}
