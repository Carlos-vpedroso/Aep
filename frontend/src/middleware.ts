import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export async function middleware(req: NextRequest) {
  // Pega o token do cookie enviado pelo navegador
  const token = req.cookies.get('token')?.value

  // Se não tiver token → redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    // Valida o token
    await jose.jwtVerify(token, secret)

    // Se quiser, pode acessar o payload do token:
    // const { payload } = await jose.jwtVerify(token, secret)
    // console.log(payload)

    return NextResponse.next()
  } catch (err) {
    // Token inválido ou expirado → redireciona para login
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [
    '/associado/dashboard/:path*',
    '/diretoria/dashboard/:path*',
    '/motorista/dashboard/:path*'
  ],
}
