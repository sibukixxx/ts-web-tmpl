'use client'
import { useEffect, useState } from 'react'
import { useTypeSafeNavigation } from '@/hooks/useTypeSafeNavigation';
import { Header } from '@/components/Navigation/Header';

export default function Home() {
  const { currentRole } = useTypeSafeNavigation();

  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/users')
      const data = await res.json()
      console.log(data) // 配列を確認
      setUsers(data)
    }
    fetchData()
  }, [])

  if (!users) return <p>Loading...</p>

  return (
    <div>
      <Header />
      <h1>Users</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.id}: {u.name}
          </li>
        ))}
      </ul>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">ホーム</h1>
        <div className="bg-white p-6 rounded shadow">
          <p className="mb-4">
            現在のロール: <span className="font-semibold">{currentRole}</span>
          </p>
          <p>このページはすべてのユーザーがアクセスできます。</p>
        </div>
      </main>
    </div>
  )
}
