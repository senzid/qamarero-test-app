import BackButton from './BackButton';

type TableData = {
  id: string;
  name: string;
  server: string;
};

const titles: Record<string, string> = {
  '/': 'Pagar la cuenta',
  '/split-equal': 'Dividir por igual',
  '/split-bill': 'Cada uno lo suyo',
  '/payment': 'Pagar la cuenta',
  '/success': 'Pago exitoso',
};

export default function Header ({ 
  tableData,
  pathname,
  showBackButton = false
}: { 
  tableData: TableData;
  pathname: string;
  showBackButton?: boolean;
}) {
  const title = titles[pathname] || 'Pagar la cuenta';

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-br from-slate-50 to-slate-100/90 backdrop-blur-sm bg-opacity-95 border-b border-slate-200/50 mb-8 -mx-4 px-4 py-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-3">
          {showBackButton && <BackButton />}
          <h1 className="text-4xl font-bold text-slate-900">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4 text-slate-600">
          <span className="font-medium">Mesa {tableData.name}</span>
          <span>•</span>
          <span>Camarero/a: {tableData.server}</span>
        </div>
      </div>
    </header>
  );
}
