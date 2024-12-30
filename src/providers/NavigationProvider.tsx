'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TypeSafeRouter } from '@/lib/routing';
import { UserRole, RouteConfig, RouterInstance } from '@/lib/routing/types';
import { defaultRouteConfig } from '@/lib/routing/config';

type NavigationContextType = {
  router: TypeSafeRouter;
  loading: boolean;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({
                                     children,
                                     initialRole = 'guest',
                                     routeConfig = defaultRouteConfig,
                                   }: {
  children: ReactNode;
  initialRole?: UserRole;
  routeConfig?: RouteConfig;
}) {
  const nextRouter = useRouter();
  const [router] = useState(() => new TypeSafeRouter('/', initialRole, routeConfig));
  const [loading, setLoading] = useState(false);

  // Next.jsのルーターをTypeSafeRouterに設定
  useEffect(() => {
    router.setRouter(nextRouter as RouterInstance);
  }, [router, nextRouter]);

  // ナビゲーション状態の監視
  useEffect(() => {
    const handleNavigation = () => {
      setLoading(router.isLoading());
    };

    router.addNavigationListener(handleNavigation);
    return () => router.removeNavigationListener(handleNavigation);
  }, [router]);

  return (
    <NavigationContext.Provider value={{ router, loading }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }
  return context;
}