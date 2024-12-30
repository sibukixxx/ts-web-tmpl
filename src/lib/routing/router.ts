import {
  RouteConfig,
  UserRole,
  MiddlewareContext,
  HistoryEntry,
  QueryParams,
  ValidationRules,
  ScrollPosition,
  RouteMetadata,
  DynamicPattern,
  StaticPattern,
  RoutePattern,
  RouterInstance
} from './types';
import {ROUTE_PATHS, DYNAMIC_ROUTE_PATTERNS} from './constants';
// https://stackoverflow.com/questions/77116856/type-approuterinstance-is-not-assignable-to-type-nextrouter
import type {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime';

type Middleware = (
  context: MiddlewareContext,
  next: () => Promise<boolean>
) => Promise<boolean>;

export class TypeSafeRouter {
  private currentPath: string;
  private currentRole: UserRole;
  private router: RouterInstance | null = null;
  private routeConfig: RouteConfig;
  // private nextRouter: AppRouterInstance | null = null;
  private middlewares: Array<(context: MiddlewareContext, next: () => Promise<boolean>) => Promise<boolean>> = [];
  private validationRules: Record<string, ValidationRules> = {};
  private history: HistoryEntry[] = [];
  private historyIndex: number = -1;
  private maxHistoryLength: number = 50;
  private scrollPositions: Map<string, ScrollPosition> = new Map();
  private loadingState: boolean = false;
  private navigationListeners: Set<(path: string) => void> = new Set();
  private errorHandlers: Set<(error: Error) => void> = new Set();

  constructor(
    initialPath: string = '/',
    initialRole: UserRole = 'guest',
    routeConfig: RouteConfig
  ) {
    this.currentPath = initialPath;
    this.currentRole = initialRole;
    this.routeConfig = routeConfig;

    // デフォルトミドルウェアの設定
    this.use(this.loggingMiddleware);
    this.use(this.permissionMiddleware);

    // 初期履歴エントリの追加
    this.addToHistory({
      path: initialPath,
      params: {},
      query: {},
      scrollPosition: {x: 0, y: 0},
      metadata: this.getMetadataForPath(initialPath),
      timestamp: Date.now()
    });
  }

  setRouter(router: RouterInstance) {
    this.router = router;
  }

  // ミドルウェア関連の実装
  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  private async executeMiddlewareChain(context: MiddlewareContext): Promise<boolean> {
    const executeMiddleware = async (index: number): Promise<boolean> => {
      if (index >= this.middlewares.length) {
        return true;
      }

      const next = async () => executeMiddleware(index + 1);
      return await this.middlewares[index](context, next);
    };

    return executeMiddleware(0);
  }

  private loggingMiddleware: Middleware = async (context, next) => {
    console.log(`Navigation requested: ${context.path}`, {
      params: context.params,
      query: context.query,
      role: context.role,
      timestamp: new Date().toISOString()
    });
    return next();
  };

  private permissionMiddleware: Middleware = async (context, next) => {
    const metadata = this.getMetadataForPath(context.path);
    if (metadata?.guards) {
      for (const guard of metadata.guards) {
        if (!(await guard.canActivate(context))) {
          console.error('Permission denied');
          return false;
        }
      }
    }
    return next();
  };

  // バリデーション関連の実装
  setValidationRules(path: string, rules: ValidationRules): void {
    this.validationRules[path] = rules;
  }


  private validateParams(
    pattern: RoutePattern | string,
    params: Record<string, string>
  ): { isValid: boolean; errors: string[] } {
    const rules = this.validationRules[pattern];
    if (!rules) return {isValid: true, errors: []};

    const errors: string[] = [];
    Object.entries(rules).forEach(([paramName, rule]) => {
      const value = params[paramName];
      if (!value) return;

      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(rule.errorMessage || `Invalid format for ${paramName}`);
      }

      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${paramName} must be at least ${rule.minLength} characters`);
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${paramName} must be at most ${rule.maxLength} characters`);
      }

      if (rule.custom && !rule.custom(value)) {
        errors.push(rule.errorMessage || `Custom validation failed for ${paramName}`);
      }
    });

    return {isValid: errors.length === 0, errors};
  }

  // 履歴管理の実装
  private addToHistory(entry: HistoryEntry): void {
    // 現在位置より先の履歴を削除
    this.history = this.history.slice(0, this.historyIndex + 1);

    // 新しいエントリを追加
    this.history.push(entry);

    // 最大履歴数を超えた場合、古いものを削除
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }

    this.historyIndex = this.history.length - 1;
  }

  async goBack(): Promise<boolean> {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const entry = this.history[this.historyIndex];
      return this.navigateToPathWithContext({
        path: entry.path,
        params: entry.params,
        query: entry.query,
        role: this.currentRole
      });
    }
    return false;
  }

  async goForward(): Promise<boolean> {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const entry = this.history[this.historyIndex];
      return this.navigateToPathWithContext({
        path: entry.path,
        params: entry.params,
        query: entry.query,
        role: this.currentRole
      });
    }
    return false;
  }

  // スクロール位置の管理
  private saveScrollPosition(path: string): void {
    this.scrollPositions.set(path, {
      x: window.scrollX,
      y: window.scrollY
    });
  }

  private restoreScrollPosition(path: string): void {
    const position = this.scrollPositions.get(path);
    if (position) {
      window.scrollTo(position.x, position.y);
    } else {
      window.scrollTo(0, 0);
    }
  }

  // ナビゲーション関連の実装
  async navigateToStatic<
    Section extends keyof typeof ROUTE_PATHS,
    Route extends keyof typeof ROUTE_PATHS[Section]
  >(
    section: Section,
    route: Route,
    query?: QueryParams
  ): Promise<boolean> {
    try {
      this.setLoading(true);

      // const path = ROUTE_PATHS[section][route] as StaticPattern;

      const path = route === 'home' ? '/' : `/${String(route)}`;

      if (this.router) {
        // リダイレクトの完了を待つ
        await Promise.resolve(this.router.push(path));
        this.currentPath = path;
        return true;
      }
      console.warn('Router is not initialized');
      return false;
    } catch (error) {
      console.error('Navigation error:', error);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async navigateToDynamic<
    Section extends keyof typeof DYNAMIC_ROUTE_PATTERNS,
    Route extends keyof typeof DYNAMIC_ROUTE_PATTERNS[Section]
  >(
    section: Section,
    route: Route,
    params: Record<string, string>,
    query?: QueryParams
  ): Promise<boolean> {
    const pattern = DYNAMIC_ROUTE_PATTERNS[section][route] as DynamicPattern;

    // パラメータのバリデーション
    const validation = this.validateParams(pattern, params);
    if (!validation.isValid) {
      console.error('Validation errors:', validation.errors);
      return false;
    }

    const path = this.generatePath(pattern, params);
    return this.navigateToPathWithContext({
      path,
      params,
      query: query || {},
      role: this.currentRole
    });
  }

  private async navigateToPathWithContext(
    context: MiddlewareContext
  ): Promise<boolean> {
    try {
      this.setLoading(true);

      // 現在のスクロール位置を保存
      this.saveScrollPosition(this.currentPath);

      // ミドルウェアチェーンの実行
      const canProceed = await this.executeMiddlewareChain(context);
      if (!canProceed) return false;

      // 実際のナビゲーション処理
      this.currentPath = context.path;

      // 履歴に追加
      this.addToHistory({
        path: context.path,
        params: context.params,
        query: context.query,
        scrollPosition: {x: 0, y: 0},
        metadata: this.getMetadataForPath(context.path),
        timestamp: Date.now()
      });

      // スクロール位置を復元
      this.restoreScrollPosition(context.path);

      return true;
    } catch (error) {
      this.handleError(error as Error);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  // ユーティリティメソッド
  private generatePath(
    pattern: RoutePattern | string,
    params: Record<string, string>
  ): string {
    return pattern.split('/').map(segment => {
      if (segment.startsWith(':')) {
        const paramName = segment.slice(1);
        return params[paramName];
      }
      return segment;
    }).join('/');
  }

  private buildQueryString(query?: QueryParams): string {
    if (!query) return '';
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value != null) {
        params.append(key, value.toString());
      }
    });
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  private getMetadataForPath(path: string): RouteMetadata {
    // パスからメタデータを検索する実装
    // 実際の実装ではルートの設定からメタデータを取得
    return {
      title: 'Default Title',
      breadcrumb: path
    };
  }

  // 状態管理メソッド
  updateUserRole(role: UserRole): void {
    this.currentRole = role;
  }

  getCurrentRole(): UserRole {
    return this.currentRole;
  }

  getCurrentPath(): string {
    return this.currentPath;
  }

  getCurrentHistoryIndex(): number {
    return this.historyIndex;
  }

  getHistory(): HistoryEntry[] {
    return [...this.history];
  }

  isLoading(): boolean {
    return this.loadingState;
  }

  // イベント管理メソッド
  private setLoading(loading: boolean): void {
    this.loadingState = loading;
    this.navigationListeners.forEach(listener =>
      listener(this.getCurrentPath())
    );
  }

  addNavigationListener(listener: (path: string) => void): void {
    this.navigationListeners.add(listener);
  }

  removeNavigationListener(listener: (path: string) => void): void {
    this.navigationListeners.delete(listener);
  }

  private handleError(error: Error): void {
    this.errorHandlers.forEach(handler => handler(error));
  }

  addErrorHandler(handler: (error: Error) => void): void {
    this.errorHandlers.add(handler);
  }

  removeErrorHandler(handler: (error: Error) => void): void {
    this.errorHandlers.delete(handler);
  }

  // パンくずリスト生成
  getBreadcrumbs(): { label: string; path: string }[] {
    const segments = this.currentPath.split('/').filter(Boolean);
    const breadcrumbs: { label: string; path: string }[] = [];
    let currentPath = '';

    segments.forEach(segment => {
      currentPath += `/${segment}`;
      const metadata = this.getMetadataForPath(currentPath);
      if (metadata?.breadcrumb) {
        breadcrumbs.push({
          label: metadata.breadcrumb,
          path: currentPath
        });
      }
    });

    return breadcrumbs;
  }
}