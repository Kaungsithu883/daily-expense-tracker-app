import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'
import * as schema from './db/schema'

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return process.env.V0_RUNTIME_URL || 'http://localhost:3000'
}

const baseURL = getBaseURL()

const getTrustedOrigins = () => {
  const origins = [baseURL]
  
  // Add Vercel production URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    origins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  }
  
  // Add Vercel preview URL
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`)
  }
  
  // Add v0 runtime URL (preview environment)
  if (process.env.V0_RUNTIME_URL) {
    origins.push(process.env.V0_RUNTIME_URL)
    // Also add variations for v0 runtime that might include subdomains
    const runtimeUrl = new URL(process.env.V0_RUNTIME_URL)
    origins.push(runtimeUrl.origin)
  }
  
  // Add localhost for development
  if (process.env.NODE_ENV === 'development') {
    origins.push('http://localhost:3000')
    origins.push('http://localhost:3001')
  }
  
  return Array.from(new Set(origins.filter(Boolean)))
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignInAfterSignUp: true,
    sendResetPasswordEmail: async () => true,
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: false,
  },
  baseURL,
  basePath: '/api/auth',
  trustedOrigins: getTrustedOrigins(),
  advanced: {
    defaultCookieAttributes:
      process.env.NODE_ENV === 'development'
        ? {
            sameSite: 'none',
            secure: true,
          }
        : undefined,
  },
})
