import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST(req: Request) {
  const { splitData } = await req.json()

  if (!splitData || !splitData.type || !splitData.people || !splitData.personTotals || !splitData.grandTotal) {
    return NextResponse.json(
      { error: 'Datos de pago no válidos' },
      { status: 400 }
    )
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: splitData.grandTotal,
          product_data: {
            name: `Servicio: ${splitData.type}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    metadata: {
      splitData,  
    },
  })

  return NextResponse.json({ url: session.url })
}
