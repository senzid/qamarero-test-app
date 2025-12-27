import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface EmailProps {
  email:string,
  subject:string,
  htmlTemplate:string,
}

export async function sendSplitedBillEmail({email, subject, htmlTemplate}:EmailProps) {
  const emailUser = process.env.EMAIL_USER_CONFIG;
  const emailPassword = process.env.PASSWORD_APP_CONFIG;

  console.log('[EMAIL] Verificando credenciales:', {
    hasEmailUser: !!emailUser,
    hasEmailPassword: !!emailPassword,
    emailUserLength: emailUser?.length || 0,
    emailPasswordLength: emailPassword?.length || 0,
  })

  if (!emailUser || !emailPassword) {
    const errorMsg = 'Las credenciales de email no están configuradas. ' +
      'Por favor, configura las variables de entorno EMAIL_USER_CONFIG y PASSWORD_APP_CONFIG en Vercel'
    console.error('[EMAIL]', errorMsg)
    throw new Error(errorMsg)
  }

 const transport = nodemailer.createTransport({
    service: 'gmail',
    /* 
      setting service as 'gmail' is same as providing these setings:
      host: "smtp.gmail.com",
      port: 465,
      secure: true
  */
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });

  const mailOptions: Mail.Options = {
    from: emailUser,
    to: email,
    subject: subject,
    html:htmlTemplate,
  };

  try {
    console.log('[EMAIL] Enviando email con nodemailer...')
    const result = await transport.sendMail(mailOptions)
    console.log('[EMAIL] Email enviado exitosamente:', {
      messageId: result.messageId,
      response: result.response,
    })
  } catch (error) {
    const errorDetails: Record<string, unknown> = {
      error: error instanceof Error ? error.message : String(error),
    }
    
    if (error && typeof error === 'object') {
      const err = error as Record<string, unknown>
      if ('code' in err) errorDetails.code = err.code
      if ('command' in err) errorDetails.command = err.command
      if ('response' in err) errorDetails.response = err.response
      if ('responseCode' in err) errorDetails.responseCode = err.responseCode
    }
    
    console.error('[EMAIL] Error de nodemailer:', errorDetails)
    throw error
  }
}