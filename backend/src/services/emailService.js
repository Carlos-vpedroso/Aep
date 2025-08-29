const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendVerificationEmail = async (to, token) => {
  const verificationLink = `${process.env.URL_SITE}/associado/verificar/${token}`;

  await transporter.sendMail({
    from: `"A.E.P." <${process.env.SMTP_USER}>`,
    to,
    subject: 'Confirme seu cadastro - A.E.P.',
    html: `
      <h1>Bem-vindo(a) à A.E.P.</h1>
      <p>Para confirmar seu cadastro, clique no link abaixo:</p>
      <a href="${verificationLink}">Confirmar Cadastro</a>
      <br/><br/>
      <p>Se você não solicitou este cadastro, ignore este e-mail.</p>
    `
  });
};

module.exports = sendVerificationEmail;