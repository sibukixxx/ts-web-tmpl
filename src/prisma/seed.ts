const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 1. Role の作成/更新
  //    例: "guest", "user", "admin" の3種を用意。
  const rolesData = [
    { name: 'guest' },
    { name: 'user' },
    { name: 'admin' },
  ]

  for (const roleData of rolesData) {
    const upsertedRole = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {}, // 既存の場合は変更項目があれば書く
      create: {
        name: roleData.name,
      },
    })
    console.log('Upserted role:', upsertedRole)
  }

  // 2. Permission の作成/更新
  //    例: "CAN_LOGIN" と "CAN_DELETE_GROUP" の2つを用意
  const permissionsData = [
    { code: 'CAN_LOGIN', name: 'Can Login' },
    { code: 'CAN_DELETE_GROUP', name: 'Can Delete Group' },
  ]

  for (const perm of permissionsData) {
    const upsertedPerm = await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: {
        code: perm.code,
        name: perm.name,
      },
    })
    console.log('Upserted permission:', upsertedPerm)
  }

  // 3. RolePermission の紐付け
  //   例: "user" ロールは "CAN_LOGIN" を持ち
  //        "admin" ロールは "CAN_LOGIN" & "CAN_DELETE_GROUP" を持つ
  //   guest は今回は何も持たない想定
  const userRole = await prisma.role.findUnique({ where: { name: 'user' } })
  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } })
  const canLogin = await prisma.permission.findUnique({ where: { code: 'CAN_LOGIN' } })
  const canDeleteGroup = await prisma.permission.findUnique({ where: { code: 'CAN_DELETE_GROUP' } })

  // rolePermissions をまとめて upsert してもOKですが、ここでは createMany 例を示します。
  // 既に同じ (roleId, permissionId) があるとユニーク制約に引っかかるため、
  // 実際の運用ではエラーハンドリング or upsert でループする方法もあります。
  await prisma.rolePermission.createMany({
    data: [
      {
        roleId: userRole.id,
        permissionId: canLogin.id,
      },
      {
        roleId: adminRole.id,
        permissionId: canLogin.id,
      },
      {
        roleId: adminRole.id,
        permissionId: canDeleteGroup.id,
      },
    ],
    skipDuplicates: true, // 既に存在する組み合わせはスキップ
  })
  console.log('Created rolePermissions for user/admin roles.')

  // 4. User の作成/更新
  //    今回は "test@example.com" を仮登録（emailVerified: false）で作成し、
  //    名前だけ入れる例。
  const tmp_user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      emailVerified: false, // 仮登録状態の場合
    },
  })
  const regular_user = await prisma.user.upsert({
    where: { email: 'regular_user@example.com' },
    update: {},
    create: {
      email: 'regular_user@example.com',
      name: '本会員１',
      emailVerified: true,
    },
  })

  console.log('Upserted user:', [tmp_user, regular_user])

  // 5. UserRole の割り当て
  //    とりあえず "user" ロールを付与しておく例
  await prisma.userRole.upsert({
    where: {
      // userId と roleId のユニーク制約に沿った一意キーとして仮定
      userId_roleId: {
        userId: tmp_user.id,
        roleId: userRole.id,
      },
    },
    update: {},
    create: {
      userId: tmp_user.id,
      roleId: userRole.id,
    },
  })
  console.log(`Assigned role "user" to user ${tmp_user.email}`)

  // 6. Group の作成
  //    グループを仮レコードとして登録 (isPlaceholder = true)
  const group = await prisma.group.create({
    data: {
      name: 'Test Group',
      isPlaceholder: true,
    },
  })
  console.log('Created group:', group)

  // 7. UserGroup でユーザーとグループを紐づけ (1:N or N:N)
  await prisma.userGroup.create({
    data: {
      userId: tmp_user.id,
      groupId: group.id,
    },
  })
  console.log(`Linked user ${tmp_user.email} to group ${group.name}`)

  // 8. UserToken (例: メール検証用トークン)
  //    一般的にはランダム生成 + 有効期限を設定し、メール送信時に使用
  const tokenValue = 'dummy_email_verify_token_12345'
  const userToken = await prisma.userToken.create({
    data: {
      userId: tmp_user.id,
      token: tokenValue,
      type: 'email_verify',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24時間後
    },
  })
  console.log('Created userToken:', userToken)

  // Plan (無料プラン) 作成 or 更新
  const plans = [
    { id: 1, planType: 'FREE', name: 'Free', price: 0 },
    { id: 2, planType: 'PAID_NORMAL', name: 'Normal', price: 1000 },
    { id: 3, planType: 'PAID_FULL', name: 'Full', price: 5000 },
    { id: 4, planType: 'CUSTOM', name: 'Custom', price: 9999 },
  ]
  for (const plan of plans) {
    const upsertedPlan = await prisma.plan.upsert({
      where: { id: plan.id }, // ユニークなIDで検索
      update: {
        // 既存の場合は "名前" と "価格" を更新
        // （ここで planType を更新しても OK だが、基本的には固定想定なら省略も可）
        name: plan.name,
        price: plan.price,
      },
      create: {
        // 新規作成の場合のデータ
        planType: plan.planType,
        name: plan.name,
        price: plan.price,
      },
    })
    console.log('Upserted plan:', upsertedPlan)
  }

  // Subscription 作成 (ユーザーに無料プランを紐付け)
  // 既にユーザーが無料プランを契約しているかどうかチェックしたい場合は findFirst などを使う
  const subscription = await prisma.subscription.create({
    data: {
      planId: 1,
      userId: tmp_user.id,
      // groupId: null, // (グループ契約でない場合は設定しない)
    },
  })
  console.log('Created subscription:', subscription)

  // 4. Billing (売上データ) 作成
  //    無料プランの場合でも 0 円で登録しておけば利用履歴として把握可能
  const billing = await prisma.billing.create({
    data: {
      subscriptionId: subscription.id,
      amount: 0, // 無料プランなので 0 円
      status: 'COMPLETED', // 決済ステータス。無料プランなら即"完了"のように扱う
      paymentMethod: 'FREE_PLAN',
      note: 'Free plan registration',
    },
  })
  console.log('Created billing:', billing)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
