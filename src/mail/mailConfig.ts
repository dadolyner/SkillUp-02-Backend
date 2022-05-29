import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false,
    auth: {
        user: 'skulj.david@gmail.com',
        pass: 'pz9f6bZMOEwkTaR7',
    },
});

export default transporter;