const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 1. User 作成 or 更新 (upsert)
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  })
  console.log('Upserted user:', user)

  // 2. Plan (無料プラン) 作成 or 更新
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
  // 3. Subscription 作成 (ユーザーに無料プランを紐付け)
  //    既にユーザーが無料プランを契約しているかどうかチェックしたい場合は findFirst などを使う
  const subscription = await prisma.subscription.create({
    data: {
      planId: 1,
      userId: user.id,
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
