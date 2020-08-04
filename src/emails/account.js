const sgMail =  require('@sendgrid/mail');
//  const sendGrindAPIkey = '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';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* let msg = {
    to: 'romasemenyshyn@gmail.com',
    from: 'romasemenyshyn@gmail.com',
    subject: 'This is my firs creation',
    text: 'I hope this one actually gets to you!'
}; */


/* sgMail.send(msg).then(() => {
    console.log('Message sent')
}).catch((error) => {
    console.log(error.response.body)
    console.log(error.response.body.errors[0].message)
}) */

const sendWelcomeEmail =  async (email, name) => {
    let message = {
        to: email,
        from: 'romasemenyshyn@gmail.com',
        subject: 'Thank you for joining in!',
        text:`Hello ${name}! Welcome to the APP. Let me know how you get along with the it.`

    };

    try {
       await sgMail.send(message);
       console.log('Message sent');

    } catch(error) {
        console.log(error)
    }
}

const sendGoodbyEmail =  async (email, name) => {
    let message = {
        to: email,
        from: 'romasemenyshyn@gmail.com',
        subject: 'Sorry to see you go :(',
        text:`Goodbye ${name}! Sadly that you're leaving our APP. Welcome back any time!`

    };

    try {
       await sgMail.send(message);
       console.log('Message sent');

    } catch(error) {
        console.log(error)
    }
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyEmail
}
