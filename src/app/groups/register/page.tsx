import { GroupRegistrationForm } from '@/components/GroupRegistrationForm'

export default function RegisterGroupPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">グループ登録</h1>
      <GroupRegistrationForm />
    </div>
  )
}
