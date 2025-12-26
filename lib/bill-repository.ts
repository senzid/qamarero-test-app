import { readFile } from 'fs/promises';
import { join } from 'path';
import { BillData } from './types';

// Repository to access bill data, this is a singleton instance to avoid multiple instances of the repository
class BillRepository {
  private billData: BillData | null = null;
  private readonly filePath: string;

  constructor() {
    this.filePath = join(process.cwd(), 'data', 'bill.json');
  }


  async getBillData(): Promise<BillData> {

    if (this.billData) {
      return this.billData;
    }

    try {
      const fileContents = await readFile(this.filePath, 'utf-8');
      const data = JSON.parse(fileContents) as BillData;
      
      if (!data.table || !data.items || !data.currency) {
        throw new Error('El archivo de factura no tiene la estructura esperada');
      }

      this.billData = data;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          throw new Error(`No se encontró el archivo de factura en: ${this.filePath}`);
        }
        if (error.message.includes('JSON')) {
          throw new Error(`El archivo de factura no es un JSON válido: ${error.message}`);
        }
      }
      throw error;
    }
  }

  clearCache(): void {
    this.billData = null;
  }
}

export const billRepository = new BillRepository();

