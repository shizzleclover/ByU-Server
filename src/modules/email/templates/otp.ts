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
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#0a0a0f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;background-color:#14141f;border-radius:16px;border:1px solid #2d2d3f;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 0;text-align:center;">
              <h1 style="margin:0;font-size:20px;font-weight:700;color:#f5f5f7;">ByU Connect</h1>
              <div style="width:40px;height:3px;background:linear-gradient(90deg,#6c5ce7,#00cec9);margin:12px auto 0;border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#f5f5f7;">${title}</p>
              <p style="margin:0 0 24px;font-size:14px;color:#8b8b9e;line-height:1.5;">
                Hey ${name}, ${subtitle}
              </p>

              <!-- OTP Code -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center" style="padding:20px;background-color:#1c1c2e;border-radius:12px;border:1px solid #2d2d3f;">
                    <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#6c5ce7;font-family:'Courier New',monospace;">${otp}</span>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:13px;color:#8b8b9e;line-height:1.5;">
                This code expires in <strong style="color:#fdcb6e;">10 minutes</strong>. If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#555;line-height:1.4;">
                &copy; ${new Date().getFullYear()} ByU Connect — Find talent. Get found.
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
