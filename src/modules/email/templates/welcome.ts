/**
 * HTML email template for the welcome email sent after verification.
 */
export const getWelcomeEmailHtml = (name: string): string => {
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
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f5f5f7;">Welcome aboard, ${name}! 🎉</p>
              <p style="margin:0 0 20px;font-size:14px;color:#8b8b9e;line-height:1.6;">
                Your account is verified and ready to go. Here's what you can do next:
              </p>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;background-color:#1c1c2e;border-radius:10px;margin-bottom:8px;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align:top;padding-right:12px;">
                          <span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:linear-gradient(135deg,#6c5ce7,#00cec9);border-radius:50%;font-size:13px;font-weight:700;color:#fff;">1</span>
                        </td>
                        <td>
                          <p style="margin:0;font-size:14px;font-weight:600;color:#f5f5f7;">Set up your passport card</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#8b8b9e;">Add your skills, role, and portfolio.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px 16px;background-color:#1c1c2e;border-radius:10px;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align:top;padding-right:12px;">
                          <span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:linear-gradient(135deg,#6c5ce7,#00cec9);border-radius:50%;font-size:13px;font-weight:700;color:#fff;">2</span>
                        </td>
                        <td>
                          <p style="margin:0;font-size:14px;font-weight:600;color:#f5f5f7;">Discover talented peers</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#8b8b9e;">Browse cards to find who you need.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px 16px;background-color:#1c1c2e;border-radius:10px;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align:top;padding-right:12px;">
                          <span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;background:linear-gradient(135deg,#6c5ce7,#00cec9);border-radius:50%;font-size:13px;font-weight:700;color:#fff;">3</span>
                        </td>
                        <td>
                          <p style="margin:0;font-size:14px;font-weight:600;color:#f5f5f7;">Post a request</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#8b8b9e;">Need help? Let talent come to you.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#8b8b9e;text-align:center;">
                Let's make talent visible. 🚀
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
