import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')

  if (!path) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 })
  }

  revalidatePath(path)

  return NextResponse.json({ revalidated: true, path })
}
