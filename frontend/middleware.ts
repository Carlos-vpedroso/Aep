import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    // Converter sua chave secreta para Uint8Array
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    // Verifica o token
    const { payload } = await jose.jwtVerify(token, secret)

    // (Opcional) checar dados do usuário no payload
    // console.log(payload)

    return NextResponse.next()
  } catch (err) {
    // Token inválido ou expirado
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/associado/dashboard/:path*'],
}
