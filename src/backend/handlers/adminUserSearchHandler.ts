import { OpenAPIHono } from '@hono/zod-openapi'
import { API_ROUTES } from '@/backend/routes'
import { Prisma, PrismaClient } from '@prisma/client';
import { getPaginationParams, createPaginationInfo } from '@/shared/utils/pagination'

export function adminUserSearchApiHandler(app: OpenAPIHono) {
  return app.openapi(API_ROUTES.admin.getUserSearch, async (c) => {
    const prisma = new PrismaClient()
    const { search, page, pageSize } = c.req.valid('query')
    const { skip, take } = getPaginationParams(page, pageSize)

    //todo 改良余地あり。検索条件: name or email に部分一致 (case-insensitive)
    const searchCondition = search
      ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { email: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        ],
      }
      : {}

    // 総件数
    const totalCount = await prisma.user.count({
      where: searchCondition,
    })

    // 該当ユーザー一覧の取得
    const users = await prisma.user.findMany({
      where: searchCondition,
      skip,
      take,
      orderBy: { id: 'asc' }, // 必要に応じてソート
    })

    const pagination = createPaginationInfo(page, pageSize, totalCount)

    return c.json({
      data: users,
      pagination,
    })
  })
}
