export const MailTemplate = (first_name: string, last_name: string, resetLink: string) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Forgot Password</title>
        </head>
        <body>

            <table>
                <tr>
                    <td>
                        <img src='https://i.postimg.cc/FK1pJk49/Geotagger-Color-Logo.png' border='0' alt='Geotagger-Color-Logo' width='20px' height='25px'/>
                        <span style="color: #619B8A; font-size: 20px;">Geo</span><span style="font-size: 20px;">tagger</span>
                    </td>
                </tr>

                <tr><td><h3 style="font-size: 16px;"><span style="font-weight: 200;">Dear </span>${first_name} ${last_name}<span style="font-weight: 200;">,</span></h3></td></tr>

                <tr><p style="margin:0;">You have requested a password change.</p></tr>
                <tr><p style="margin:0;">Please click on the link below to change your password.</p></tr>
                <tr><td>&nbsp;</td></tr>

                <tr><a href="${resetLink}">Change password</a></tr>
                <tr><td>&nbsp;</td></tr>

                <h4 style="margin:0;">If you did not request to change your password, please ignore this email.</h4>
                <tr><td>&nbsp;</td></tr>

                <tr><p style="margin:0;">Best regards,</p></tr>
                <tr><span style="color: #619B8A; font-size: 16px;">Geo</span><span style="font-size: 16px;">tagger Team</span></tr>

            </table>
        </body>
        </html>
    `;
}