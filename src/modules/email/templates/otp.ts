import { env } from '../../../config/env';

/**
 * HTML email template for OTP verification / password reset.
 */
export const getOtpEmailHtml = (
  name: string,
  otp: string,
  isPasswordReset: boolean = false
): string => {
  const title = isPasswordReset ? 'Reset Your Password' : 'Verify Your Email';
  const subtitle = isPasswordReset
    ? 'Use the code below to reset your password.'
    : 'Use the code below to verify your ByU Connect account.';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Plus Jakarta Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#0a0a0f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;background-color:#14141f;border-radius:24px;border:1px solid #2d2d3f;overflow:hidden;box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
          
          <!-- Header -->
          <tr>
            <td style="padding:40px 32px 0;text-align:center;">
              <img src="${env.CLIENT_URL}/img/logo.svg" alt="ByU Connect" width="48" height="48" style="display:block;margin:0 auto;filter: invert(1);" />
              <h1 style="margin:16px 0 0;font-size:24px;font-weight:800;color:#f5f5f7;letter-spacing:-0.02em;">ByU Connect</h1>
              <div style="width:40px;height:4px;background:#e78a53;margin:12px auto 0;border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#f5f5f7;">${title}</p>
              <p style="margin:0 0 32px;font-size:15px;color:#8b8b9e;line-height:1.6;">
                Hey <strong style="color:#f5f5f7;">${name}</strong>, ${subtitle}
              </p>

              <!-- OTP Code -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center" style="padding:28px;background-color:#1c1c2e;border-radius:20px;border:1px solid #2d2d3f;box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);">
                    <span style="font-size:42px;font-weight:800;letter-spacing:10px;color:#e78a53;font-family:'Courier New', monospace;">${otp}</span>
                  </td>
                </tr>
              </table>

              <p style="margin:32px 0 0;font-size:13px;color:#8b8b9e;line-height:1.6;text-align:center;">
                This code expires in <strong style="color:#e78a53;">10 minutes</strong>. If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#555;line-height:1.6;font-weight:500;">
                &copy; ${new Date().getFullYear()} ByU Connect &bull; Babcock University Campus Talent Discovery
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#444;">
                Find talent. Get found. Create something great.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
