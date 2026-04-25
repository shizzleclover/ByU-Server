import { env } from '../../../config/env';

export const getConnectionInterestHtml = (talentName: string, interestedUserName: string) => `
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
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:500px;background-color:#14141f;border-radius:24px;border:1px solid #2d2d3f;overflow:hidden;box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
          
          <!-- Header -->
          <tr>
            <td style="padding:40px 32px 0;text-align:center;">
              <img src="${env.CLIENT_URL}/img/logo.svg" alt="ByU Connect" width="48" height="48" style="display:block;margin:0 auto;filter: invert(1);" />
              <h1 style="margin:16px 0 0;font-size:24px;font-weight:800;color:#f5f5f7;letter-spacing:-0.02em;">Someone is interested! 🚀</h1>
              <div style="width:40px;height:4px;background:#e78a53;margin:12px auto 0;border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;color:#f5f5f7;line-height:1.6;">
                Hey <strong style="color:#e78a53;">${talentName}</strong>,
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#8b8b9e;line-height:1.7;">
                Great news! A fellow student at <strong>Babcock University</strong> is interested in your talent. 
                <br /><br />
                <strong>${interestedUserName}</strong> just swiped right on your profile! This is a great opportunity to connect and collaborate on something cool.
              </p>

              <div style="text-align:center; margin-top: 32px;">
                <a href="${env.CLIENT_URL}/profile/${interestedUserName}" style="display:inline-block;padding:16px 32px;background-color:#f5f5f7;color:#000;text-decoration:none;border-radius:14px;font-size:15px;font-weight:700;box-shadow: 0 4px 12px rgba(0,0,0,0.2);">View their Passport</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#555;line-height:1.6;font-weight:500;">
                &copy; ${new Date().getFullYear()} ByU Connect &bull; Babcock University Campus Talent Discovery
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#444;line-height:1.4;">
                Collaboration is the future of talent.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
