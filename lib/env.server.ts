import { z } from 'zod';

/**
 * Schema para validar variables de entorno del servidor
 * Estas variables solo están disponibles en el servidor (no se exponen al cliente)
 */
const serverEnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY es requerida'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});


function validateServerEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('env.server.ts solo puede usarse en el servidor');
  }

  const parsed = serverEnvSchema.safeParse({
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    const errorMessage = [
      '❌ Error en variables de entorno del servidor:',
      ...parsed.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`),
      '',
      'Asegúrate de que todas las variables de servidor estén configuradas en tu archivo .env',
    ].join('\n');
    
    console.error(errorMessage);
    throw new Error('Variables de entorno del servidor inválidas');
  }

  return parsed.data;
}

export const serverEnv = validateServerEnv();

