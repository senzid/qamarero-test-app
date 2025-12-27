import { NextResponse } from 'next/server'
import { sendPaymentEmailFromSession } from '@/features/payment/send-payment-email'

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID es requerido' },
        { status: 400 }
      )
    }

    await sendPaymentEmailFromSession(sessionId)

    return NextResponse.json({ message: 'Email enviado correctamente' })
  } catch (error) {
    console.error('[EMAIL ERROR] Error en API route:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    const errorMessage = error instanceof Error ? error.message : 'Error al enviar el email'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

