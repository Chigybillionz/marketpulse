const nodemailer = require('nodemailer');

let transporter;

const getBooleanEnv = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
};

const getMailFrom = () => {
  return process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.SMTP_USER || 'Stockpile <no-reply@stockpile.market>';
};

const buildTransportOptions = () => {
  const { SMTP_SERVICE, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    return null;
  }

  if (SMTP_HOST) {
    const port = Number(SMTP_PORT || 587);

    return {
      host: SMTP_HOST,
      port,
      secure: getBooleanEnv(process.env.SMTP_SECURE, port === 465),
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    };
  }

  return {
    service: SMTP_SERVICE || 'gmail',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  };
};

// Initialize transporter lazily so env vars are available before first use.
function getTransporter() {
  if (transporter !== undefined) return transporter;

  const options = buildTransportOptions();
  if (!options) {
    transporter = null;
    return null;
  }

  try {
    transporter = nodemailer.createTransport(options);
  } catch (err) {
    console.error('[Stockpile EmailService] Failed to initialize mail transporter:', err.message);
    transporter = null;
  }

  return transporter;
}

const sendResetCodeEmail = async (toEmail, code) => {
  const transport = getTransporter();

  if (!transport) {
    console.warn(`[Stockpile EmailService] SMTP not configured. Simulated Trade PIN reset code for ${toEmail}: [ ${code} ]`);
    return { delivered: false, simulated: true, code };
  }

  try {
    const info = await transport.sendMail({
      from: getMailFrom(),
      to: toEmail,
      subject: 'Your Trade PIN Reset Code',
      text: `Your reset code is ${code}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #052e16;">Stockpile</h2>
          <p>Hi there,</p>
          <p>You requested a Trade PIN reset. Here is your 4-digit reset code:</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #f8fafc; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e293b;">
            ${code}
          </div>
          <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes. If you did not request this reset, please ignore this email.</p>
        </div>
      `,
    });

    console.log('[Stockpile EmailService] Trade PIN email sent: %s', info.messageId);
    return { delivered: true, messageId: info.messageId, code };
  } catch (error) {
    console.error('[Stockpile EmailService] Error sending email via SMTP:', error.message);
    console.warn(`[Stockpile EmailService] Fallback reset code for ${toEmail}: [ ${code} ]`);
    return { delivered: false, simulated: true, code, error: error.message };
  }
};

const sendPasswordResetCodeEmail = async (toEmail, code) => {
  const transport = getTransporter();

  if (!transport) {
    console.warn(`[Stockpile EmailService] SMTP not configured. Simulated password reset code for ${toEmail}: [ ${code} ]`);
    return { delivered: false, simulated: true, code };
  }

  try {
    const info = await transport.sendMail({
      from: getMailFrom(),
      to: toEmail,
      subject: 'Your Password Reset Code',
      text: `You requested a password reset. Your code is ${code}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #052e16;">Stockpile</h2>
          <p>Hi there,</p>
          <p>You requested a password reset. Here is your 4-digit reset code:</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #f8fafc; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e293b;">
            ${code}
          </div>
          <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes. If you did not request this reset, please ignore this email.</p>
        </div>
      `,
    });

    console.log('[Stockpile EmailService] Password reset email sent: %s', info.messageId);
    return { delivered: true, messageId: info.messageId, code };
  } catch (error) {
    console.error('[Stockpile EmailService] Error sending password reset email via SMTP:', error.message);
    console.warn(`[Stockpile EmailService] Fallback password reset code for ${toEmail}: [ ${code} ]`);
    return { delivered: false, simulated: true, code, error: error.message };
  }
};

module.exports = {
  sendResetCodeEmail,
  sendPasswordResetCodeEmail,
};
