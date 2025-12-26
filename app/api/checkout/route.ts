import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { BillItem } from '@/lib/types';
import { formatCurrency } from '@/lib/format-currency';
import { serverEnv } from '@/lib/env.server';
import { clientEnv } from '@/lib/env.client';
import { billRepository } from '@/lib/bill-repository';

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY)

export async function POST(req: Request) {
  const { splitData } = await req.json()

  if (!splitData || !splitData.tableId || !splitData.people || !splitData.personTotals) {
    return NextResponse.json(
      { error: 'Datos de pago no válidos' },
      { status: 400 }
    )
  }

  try {
    const data = await billRepository.getBillData();

    if (data.table.id !== splitData.tableId) {
      return NextResponse.json(
        { error: 'La mesa no coincide con la mesa de la factura' },
        { status: 400 }
      )
    }

    const grandTotal = data.items.reduce((acc: number, item: BillItem) => acc + item.unitPrice * item.qty, 0);
    const tip = splitData.tip || 0;

    const unitAmount = parseInt(formatCurrency(grandTotal, data.currency).replace(/[^0-9]/g, ''));

    let cancelUrl = `${clientEnv.NEXT_PUBLIC_SITE_URL}`;
    if (splitData.method && splitData.type) {
      cancelUrl += `/payment?method=${splitData.method}&type=${splitData.type}`;
      if (splitData.tip) {
        cancelUrl += `&tip=${splitData.tip}`;
      }
    }
    
    const lineItems = [
      {
        price_data: {
          currency: data.currency,
          unit_amount: unitAmount,
          product_data: {
            name: `Servicio: ${data.table.name}`,
          },
        },
        quantity: 1,
      },
    ]

    if (tip > 0) {
      const tipAmount = parseInt(formatCurrency(tip, data.currency).replace(/[^0-9]/g, ''));
      lineItems.push({
        price_data: {
          currency: 'eur',
          unit_amount: tipAmount,
          product_data: {
            name: 'Propina',
          },
        },
        quantity: 1,
      })
    }
    
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${clientEnv.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        tableId: splitData.tableId 
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error processing checkout:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
