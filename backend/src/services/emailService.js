const Mailgun = require("mailgun-js");

const mg = Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const sendVerificationEmail = async (to, token) => {
  const verificationLink = `${process.env.URL_SITE}/associado/verificar/${token}`;

  const data = {
    from: process.env.MAILGUN_FROM,
    to,
    subject: "Confirme seu cadastro - A.E.P.",
    html: `
      <h1>Bem-vindo(a) à A.E.P.</h1>
      <p>Para confirmar seu cadastro, clique no link abaixo:</p>
      <a href="${verificationLink}">Confirmar Cadastro</a>
      <br/><br/>
      <p>Se você não solicitou este cadastro, ignore este e-mail.</p>
    `,
  };

  return mg.messages().send(data);
};

const sendResetPasswordEmail = async (to, token) => {
  const resetLink = `${process.env.URL_SITE}/reset-password/${token}`;

  const data = {
    from: process.env.MAILGUN_FROM,
    to,
    subject: "Redefinição de senha - A.E.P.",
    html: `
      <h2>Redefinir senha</h2>
      <p>Clique no link abaixo para redefinir sua senha (válido por 1 hora):</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  };

  return mg.messages().send(data);
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
