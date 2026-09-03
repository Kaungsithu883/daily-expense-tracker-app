import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST() {
  const credentials = [
    { email: 'admin@admin.com', name: 'Admin', password: 'admin' },
    { email: 'kst@gmail.com', name: 'KST', password: 'kst2512001' },
  ]

  for (const credential of credentials) {
    const existing = await db.query.user.findFirst({
      where: (fields, { eq }) => eq(fields.email, credential.email),
    })
    if (existing) continue

    const result = await auth.api.signUpEmail({
      body: credential,
    })
    if (!result?.user) {
      return NextResponse.json({ error: 'Unable to seed users' }, { status: 500 })
    }
  }

  return NextResponse.json({ seeded: true })
}
