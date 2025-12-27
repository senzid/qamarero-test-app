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

  if (!emailUser || !emailPassword) {
    throw new Error(
      'Las credenciales de email no están configuradas. ' +
      'Por favor, configura las variables de entorno EMAIL_USER_CONFIG y PASSWORD_APP_CONFIG en tu archivo .env'
    );
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

  await transport.sendMail(mailOptions)
}