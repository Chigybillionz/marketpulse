const nodemailer = require('nodemailer');

let transporter;

const getBooleanEnv = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
};

const getMailFrom = () => {
  return process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.SMTP_USER;
};

const buildTransportOptions = () => {
  const { SMTP_SERVICE, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP_USER and SMTP_PASS are required to send reset emails.');
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
    };
  }

  return {
    service: SMTP_SERVICE || 'gmail',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  };
};

// Initialize transporter lazily so env vars are available before first use.
function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport(buildTransportOptions());
  
  return transporter;
}

const sendResetCodeEmail = async (toEmail, code) => {
  try {
    const transport = getTransporter();

    const info = await transport.sendMail({
      from: getMailFrom(),
      to: toEmail,
      subject: 'Your Trade PIN Reset Code',
      text: `Your reset code is ${code}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #052e16;">MarketPulse AI</h2>
          <p>Hi there,</p>
          <p>You requested a Trade PIN reset. Here is your 4-digit reset code:</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #f8fafc; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e293b;">
            ${code}
          </div>
          <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes. If you did not request this reset, please ignore this email.</p>
        </div>
      `,
    });

    console.log('Real email successfully sent: %s', info.messageId);

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

const sendPasswordResetCodeEmail = async (toEmail, code) => {
  try {
    const transport = getTransporter();

    const info = await transport.sendMail({
      from: getMailFrom(),
      to: toEmail,
      subject: 'Your Password Reset Code',
      text: `You requested a password reset. Your code is ${code}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #052e16;">MarketPulse AI</h2>
          <p>Hi there,</p>
          <p>You requested a password reset. Here is your 4-digit reset code:</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #f8fafc; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e293b;">
            ${code}
          </div>
          <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes. If you did not request this reset, please ignore this email.</p>
        </div>
      `,
    });

    console.log('Password reset email successfully sent: %s', info.messageId);

    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = {
  sendResetCodeEmail,
  sendPasswordResetCodeEmail,
};
