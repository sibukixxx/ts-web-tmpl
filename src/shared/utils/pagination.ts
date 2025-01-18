/**
 * ページネーションに必要な skip, take を返す
 * @param page 現在のページ番号 (1-based)
 * @param pageSize 1ページあたりの件数
 * @returns { skip, take }
 */
export function getPaginationParams(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize
  const take = pageSize
  return { skip, take }
}

/**
 * ページネーション情報をまとめたオブジェクトを作成
 * @param page 現在のページ番号 (1-based)
 * @param pageSize 1ページあたりの件数
 * @param totalCount 該当する全件数
 * @returns ページネーション情報
 */
export function createPaginationInfo(page: number, pageSize: number, totalCount: number) {
  const totalPages = Math.ceil(totalCount / pageSize)

  return {
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}
