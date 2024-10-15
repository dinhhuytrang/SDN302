const nodemailer = require('nodemailer');

// Function to send email
const sendEmail = (to, subject, text, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'swp2357@gmail.com',
            pass: 'fhtmahqfwcvbbtvb',
        },
    });

    const mailOptions = {
        from: 'swp2357@gmail.com',
        to: to,
        subject: subject,
        text: text,
        html: html,
    };

    return transporter.sendMail(mailOptions);
};

// Export the function to use it in other files
module.exports = sendEmail;
