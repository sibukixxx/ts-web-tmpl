import { ROUTE_PATHS, DYNAMIC_ROUTE_PATTERNS } from './constants';
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export type ValidStaticRoutes = typeof ROUTE_PATHS;

export type RouteSection = keyof ValidStaticRoutes;
export type RouteKey<T extends RouteSection> = keyof ValidStaticRoutes[T];

export type DynamicRoutePatterns = typeof DYNAMIC_ROUTE_PATTERNS;

export type UserRole = 'guest' | 'user' | 'admin';

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export interface RouterInstance extends AppRouterInstance {
  push: (path: string) => void;
}

type ExtractPattern<T> = T extends { [K: string]: infer U }
  ? U extends { [K: string]: string }
    ? U[keyof U]
    : never
  : never;
export type DynamicPattern = ExtractPattern<typeof DYNAMIC_ROUTE_PATTERNS>;
export type StaticPattern = ExtractPattern<typeof ROUTE_PATHS>;
export type RoutePattern = StaticPattern | DynamicPattern;

// 動的ルートのパラメータを抽出する型
export type ExtractRouteParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${infer _}/:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractRouteParams<`/${Rest}`>]: string }
    : T extends `${infer _}/:${infer Param}`
      ? { [K in Param]: string }
      : {};

export type DynamicRouteSection = keyof DynamicRoutePatterns;
export type DynamicRouteKey<T extends DynamicRouteSection> = keyof DynamicRoutePatterns[T];

export type PathValue<TSection extends DynamicRouteSection,
  TRoute extends DynamicRouteKey<TSection>
> = DynamicRoutePatterns[TSection][TRoute] extends string
  ? DynamicRoutePatterns[TSection][TRoute]
  : never;

// パラメータの型を取得
export type RouteParams<TSection extends DynamicRouteSection,
  TRoute extends DynamicRouteKey<TSection>
> = ExtractRouteParams<PathValue<TSection, TRoute>>;

export type ValidationRule = {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: string) => boolean;
  errorMessage?: string;
};

export type ValidationRules = {
  [ParamName: string]: ValidationRule;
};

export type MiddlewareContext = {
  path: string;
  params: Record<string, string>;
  query: QueryParams;
  role: UserRole;
};

export type NextFunction = () => Promise<boolean>;

export type Middleware = (
  context: MiddlewareContext,
  next: NextFunction
) => Promise<boolean>;

export type RouteGuard = {
  canActivate: (context: MiddlewareContext) => Promise<boolean>;
  canDeactivate: (context: MiddlewareContext) => Promise<boolean>;
};

export type RouteMetadata = {
  title: string;
  guards?: RouteGuard[];
  breadcrumb?: string;
  layout?: string;
};

export type RouteConfig = {
  [Section in keyof ValidStaticRoutes]: {
    [Route in keyof ValidStaticRoutes[Section]]: RouteMetadata;
  };
} & {
  dynamic: {
    [Section in keyof DynamicRoutePatterns]: {
      [Route in keyof DynamicRoutePatterns[Section]]: RouteMetadata;
    };
  };
};

export type ScrollPosition = {
  x: number;
  y: number;
};

export type HistoryEntry = {
  path: string;
  params: Record<string, string>;
  query: QueryParams;
  timestamp: number;
  scrollPosition: ScrollPosition;
  metadata: RouteMetadata;
};
