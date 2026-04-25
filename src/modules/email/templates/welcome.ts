import { env } from '../../../config/env';

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
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Plus Jakarta Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#0a0a0f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;background-color:#14141f;border-radius:24px;border:1px solid #2d2d3f;overflow:hidden;box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
          
          <!-- Header -->
          <tr>
            <td style="padding:40px 32px 0;text-align:center;">
              <img src="${env.CLIENT_URL}/img/logo.svg" alt="ByU Connect" width="48" height="48" style="display:block;margin:0 auto;filter: invert(1);" />
              <h1 style="margin:16px 0 0;font-size:24px;font-weight:800;color:#f5f5f7;letter-spacing:-0.02em;">Welcome aboard, ${name}! 🎉</h1>
              <div style="width:40px;height:4px;background:#e78a53;margin:12px auto 0;border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 24px;font-size:15px;color:#8b8b9e;line-height:1.7;text-align:center;">
                Your account is verified and you're now part of the <strong>Babcock University</strong> talent network. Let's get you started.
              </p>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:20px;background-color:#1c1c2e;border-radius:16px;border:1px solid #2d2d3f;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align:top;padding-right:16px;">
                          <span style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;background:#e78a53;border-radius:10px;font-size:14px;font-weight:800;color:#000;">1</span>
                        </td>
                        <td>
                          <p style="margin:0;font-size:15px;font-weight:700;color:#f5f5f7;">Claim your Talent Passport</p>
                          <p style="margin:6px 0 0;font-size:13px;color:#8b8b9e;line-height:1.5;">Customize your card with your skills, role, and bio to stand out.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:12px;"></td></tr>
                <tr>
                  <td style="padding:20px;background-color:#1c1c2e;border-radius:16px;border:1px solid #2d2d3f;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align:top;padding-right:16px;">
                          <span style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;background:#e78a53;border-radius:10px;font-size:14px;font-weight:800;color:#000;">2</span>
                        </td>
                        <td>
                          <p style="margin:0;font-size:15px;font-weight:700;color:#f5f5f7;">Discover talented peers</p>
                          <p style="margin:6px 0 0;font-size:13px;color:#8b8b9e;line-height:1.5;">Swipe through profiles or use the directory to find collaborators.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:12px;"></td></tr>
                <tr>
                  <td style="padding:20px;background-color:#1c1c2e;border-radius:16px;border:1px solid #2d2d3f;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align:top;padding-right:16px;">
                          <span style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;background:#e78a53;border-radius:10px;font-size:14px;font-weight:800;color:#000;">3</span>
                        </td>
                        <td>
                          <p style="margin:0;font-size:15px;font-weight:700;color:#f5f5f7;">Make a connection</p>
                          <p style="margin:6px 0 0;font-size:13px;color:#8b8b9e;line-height:1.5;">Reach out to talent you admire and start building something together.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <div style="text-align:center;">
                <a href="${env.CLIENT_URL}/profile" style="display:inline-block;padding:16px 32px;background-color:#f5f5f7;color:#000;text-decoration:none;border-radius:14px;font-size:15px;font-weight:700;box-shadow: 0 4px 12px rgba(0,0,0,0.2);">Go to my Profile</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#555;line-height:1.6;font-weight:500;">
                &copy; ${new Date().getFullYear()} ByU Connect &bull; Babcock University Campus Talent Discovery
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#444;">
                Let's make talent visible. 🚀
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
