'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { groupSchema, GroupFormData } from '@/schemas/groupSchema'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/backend/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export function GroupRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  async function onSubmit(data: GroupFormData) {
    setIsLoading(true)
    try {
      const { data: group, error } = await supabase
        .from('groups')
        .insert([{ name: data.name, description: data.description }])
        .select()

      if (error) throw error

      toast({
        title: 'グループ登録成功',
        description: `${data.name}が正常に登録されました。`,
      })
      form.reset()
    } catch (error) {
      console.error('登録エラー:', error)
      toast({
        title: 'エラー',
        description: 'グループの登録中にエラーが発生しました。',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>グループ名</FormLabel>
                <FormControl>
                  <Input placeholder="グループ名" {...field} />
                </FormControl>
                <FormDescription>あなたのグループの名前です。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>説明</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="グループの説明を入力してください"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  グループの目的や活動内容を簡単に説明してください。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '登録中...' : 'グループを登録'}
          </Button>
        </form>
      </Form>
    </>
  )
}
