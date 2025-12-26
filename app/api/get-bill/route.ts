import { NextResponse } from 'next/server';
import { billRepository } from '@/lib/bill-repository';

export async function GET() {
  try {
    const data = await billRepository.getBillData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching bill data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bill data';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

