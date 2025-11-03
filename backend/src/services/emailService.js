const Mailgun = require("mailgun-js");

const mg = Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
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
    `
  };

  try {
    const body = await mg.messages().send(data);
    console.log("✅ E-mail enviado para", to, body);
  } catch (err) {
    console.error("❌ Erro ao enviar e-mail:", err);
  }
};

module.exports = sendVerificationEmail;
