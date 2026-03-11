const brevo = require("@getbrevo/brevo");

async function sendEmail(to, summary) {

  const apiInstance = new brevo.TransactionalEmailsApi();

  apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );

  const email = new brevo.SendSmtpEmail();

  email.subject = "AI Generated Sales Report";
  email.htmlContent = `<h3>Sales Summary</h3><p>${summary}</p>`;
  email.sender = {
    name: "Sales Insight Automator",
    email: process.env.SENDER_EMAIL
  };

  email.to = [{ email: to }];

  await apiInstance.sendTransacEmail(email);
}

module.exports = sendEmail;