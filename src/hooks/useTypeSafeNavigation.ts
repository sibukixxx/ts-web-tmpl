'use client';

import { useCallback } from 'react';
import { useNavigationContext } from '@/providers/NavigationProvider';
import type {  } from '@/lib/routing/types';
import type {
  RouteSection,
  RouteKey,
  DynamicRouteSection,
  DynamicRouteKey,
  RouteParams,
  QueryParams,
  UserRole,
} from '@/lib/routing/types';

export function useTypeSafeNavigation() {
  const { router, loading } = useNavigationContext();

  const navigate = useCallback(
    <TSection extends DynamicRouteSection, TRoute extends DynamicRouteKey<TSection>>(
      section: TSection,
      route: TRoute,
      params: RouteParams<TSection, TRoute>,
      query?: QueryParams
    ) => {
      return router.navigateToDynamic(section, route, params, query);
    },
    [router]
  );

  const navigateStatic = useCallback(
    <TSection extends RouteSection, TRoute extends RouteKey<TSection>>(
      section: TSection,
      route: TRoute,
      query?: QueryParams
    ) => {
      return router.navigateToStatic(section, route, query);
    },
    [router]
  );

  const updateRole = useCallback((role: UserRole) => {
    router.updateUserRole(role);
  }, [router]);

  return {
    navigate,
    navigateStatic,
    updateRole,
    loading,
    currentRole: router.getCurrentRole(),
    currentPath: router.getCurrentPath(),
    breadcrumbs: router.getBreadcrumbs(),
    goBack: router.goBack.bind(router),
    goForward: router.goForward.bind(router),
  };
}