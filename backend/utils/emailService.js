const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // If credentials aren't set, we log instead of failing in dev
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('--- MOCK EMAIL SENT ---');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Message:', options.message);
        console.log('------------------------');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your preferred service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `Power World Gym <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
