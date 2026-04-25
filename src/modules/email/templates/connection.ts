export const getConnectionInterestHtml = (talentName: string, interestedUserName: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
        .header { background: #d87943; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 0.8em; color: #777; margin-top: 20px; }
        .button { display: inline-block; padding: 10px 20px; background: #d87943; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ByU Connect</h1>
        </div>
        <div class="content">
            <p>Hey ${talentName},</p>
            <p>Great news! A fellow student at <strong>Babcock University</strong> is interested in your talent.</p>
            <p><strong>${interestedUserName}</strong> just swiped right on your profile!</p>
            <p>This is a great opportunity to connect and collaborate on something cool.</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="https://byu-connect.com/profile/${interestedUserName}" class="button">View their Passport</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 ByU Connect — Babcock University Campus Talent Discovery</p>
        </div>
    </div>
</body>
</html>
`;
