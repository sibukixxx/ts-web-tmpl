'use client'
import { useEffect, useState } from 'react'

export default function Home() {
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
      <h1>Users</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.id}: {u.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
