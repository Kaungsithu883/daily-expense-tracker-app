'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (mode === 'sign-up') {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        })
        if (result.error) {
          setError(result.error.message || 'Signup failed')
          setIsLoading(false)
          return
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        })
        if (result.error) {
          setError(result.error.message || 'Sign in failed')
          setIsLoading(false)
          return
        }
      }

      // Delay redirect slightly to ensure session cookie is set
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('[v0] Auth error:', err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg border border-border shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2 text-foreground">
          {mode === 'sign-in' ? 'Sign In' : 'Create Account'}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === 'sign-in'
            ? 'Enter your credentials to sign in'
            : 'Create a new account to get started'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'sign-up' && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading
              ? 'Loading...'
              : mode === 'sign-in'
                ? 'Sign In'
                : 'Create Account'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          {mode === 'sign-in' ? (
            <>
              Don&apos;t have an account?{' '}
              <a href="/sign-up" className="text-primary hover:underline">
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a href="/sign-in" className="text-primary hover:underline">
                Sign in
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
