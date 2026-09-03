import { auth } from '@/lib/auth'
import { AuthForm } from '@/components/auth-form'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export const metadata = {
  title: 'Sign In - Expense Tracker',
}

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-5">
      <AuthForm mode="sign-in" />
    </main>
  )
}
