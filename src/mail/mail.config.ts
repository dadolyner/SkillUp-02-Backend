import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.STMP_USER,
        pass: process.env.STMP_PASS,
    },
});

export default transporter;