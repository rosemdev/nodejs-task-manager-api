const sgMail =  require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail =  async (email, name) => {
    let message = {
        to: email,
        from: 'romanna@gmail.com',
        subject: 'Thank you for joining in!',
        text:`Hello ${name}! Welcome to the APP. Let me know how you get along with the it.`

    };

    try {
       await sgMail.send(message);
    } catch(error) {
        console.log(error)
    }
}

const sendGoodbyEmail = async (email, name) => {
    let message = {
        to: email,
        from: 'romanna@gmail.com',
        subject: 'Sorry to see you go :(',
        text:`Goodbye ${name}! Sadly that you're leaving our APP. Welcome back any time!`

    };

    try {
       await sgMail.send(message);

    } catch(error) {
        console.log(error)
    }
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyEmail
}
