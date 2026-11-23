const config = require("../config");

module.exports = async function sendEmail({ to, subject, text, html }) {
  if (!config.RESEND_API_KEY || !config.EMAIL_FROM) {
    throw new Error("Set RESEND_API_KEY and EMAIL_FROM to send email.");
  }

  let response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: config.EMAIL_FROM, to, subject, text, html }),
      signal: AbortSignal.timeout(8000),
      redirect: "error",
    });
    await response.body?.cancel();
  } catch {
    throw new Error("Could not reach the Resend email API.");
  }

  if (!response.ok) {
    throw new Error(`Resend rejected the email (HTTP ${response.status}).`);
  }
};
