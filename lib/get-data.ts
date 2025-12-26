import { clientEnv } from '@/lib/env.client';
import { serverEnv } from '@/lib/env.server';

export async function getBillData() {
  const baseUrl = clientEnv.NEXT_PUBLIC_API_URL;
  
  try {
    const res = await fetch(`${baseUrl}/api/get-bill`, {
      cache: "force-cache",
    });

    if (!res.ok) throw new Error("Error al cargar datos globales");

    return res.json();
  } catch (error) {
    // Durante el build estático, el servidor no está disponible
    // Retornamos null para que el layout pueda manejar este caso
    // En runtime, esto no ocurre ya que el servidor está disponible
    const err = error as Error & { code?: string; cause?: { code?: string } };
    const errorCode = err.code || err.cause?.code;
    
    if (serverEnv.NODE_ENV === 'production' && errorCode === 'ECONNREFUSED') {
      console.warn('No se pudo conectar al servidor durante el build. Los datos se cargarán en runtime.');
      return null;
    }
    throw error;
  }
}
