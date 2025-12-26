import { z } from 'zod';

/**
 * Schema para validar variables de entorno del cliente
 * Estas variables están disponibles tanto en el servidor como en el cliente
 * (prefijo NEXT_PUBLIC_)
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL debe ser una URL válida'),
  NEXT_PUBLIC_SITE_URL: z.string().url('NEXT_PUBLIC_SITE_URL debe ser una URL válida'),
});

function validateClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!parsed.success) {
    const errorMessage = [
      '❌ Error en variables de entorno del cliente:',
      ...parsed.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`),
      '',
      'Asegúrate de que todas las variables NEXT_PUBLIC_* estén configuradas en tu archivo .env',
    ].join('\n');
    
    console.error(errorMessage);
    throw new Error('Variables de entorno del cliente inválidas');
  }

  return parsed.data;
}

export const clientEnv = validateClientEnv();

