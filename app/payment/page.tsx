import Header from '@/components/Header';
import PaymentContent from '@/components/PaymentContent';
import { getBillData } from '@/lib/get-data';

export default async function PaymentPage() {
  const billData = await getBillData();
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 pt-4 pb-8 max-w-6xl">
        <Header tableData={billData.table} pathname="/payment" showBackButton={true} />
        <div className="pt-4">
          <PaymentContent />
        </div>
      </div>
    </main>
  );
}
