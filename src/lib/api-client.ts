import { useAuthStore } from '@/stores/authStore'

interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean
}

/**
 * 認証付きAPIリクエストヘルパー
 */
export async function apiRequest(url: string, options: ApiRequestOptions = {}) {
  const { requireAuth = true, headers = {}, ...restOptions } = options
  
  // 認証が必要な場合はトークンを追加
  if (requireAuth) {
    const session = useAuthStore.getState().session
    if (session?.auth.access_token) {
      headers['Authorization'] = `Bearer ${session.auth.access_token}`
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || `API Error: ${response.status}`)
  }

  return response.json()
}

/**
 * 型安全なAPIクライアント作成
 */
export function createApiClient<T extends Record<string, any>>(baseUrl: string) {
  return {
    get: async (path: string, options?: ApiRequestOptions) => {
      return apiRequest(`${baseUrl}${path}`, { ...options, method: 'GET' }) as Promise<T>
    },
    post: async (path: string, data?: any, options?: ApiRequestOptions) => {
      return apiRequest(`${baseUrl}${path}`, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
      }) as Promise<T>
    },
    put: async (path: string, data?: any, options?: ApiRequestOptions) => {
      return apiRequest(`${baseUrl}${path}`, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
      }) as Promise<T>
    },
    delete: async (path: string, options?: ApiRequestOptions) => {
      return apiRequest(`${baseUrl}${path}`, { ...options, method: 'DELETE' }) as Promise<T>
    },
  }
}