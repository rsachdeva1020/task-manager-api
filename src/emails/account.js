const sgMail = require('@sendgrid/mail');


// const sendgridAPIKey = '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'

// to tell sendgrid that we will be working with this api key
// sgMail.setApiKey(sendgridAPIKey);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendWelcomeEmail(email, name){
    sgMail.send({
        to : email,
        from : 'rohanshubhammitv@gmail.com',
        subject : 'Thanks for Signing Up',
        text : `Welcome to the Task App ${name}. Let me know how you can get along`,
        // html : '',
    })
}

function sendCancelationEmail(email, name){
    sgMail.send({
        to : email,
        from : 'rohanshubhammitv@gmail.com',
        subject : 'Sorry to see you go!',
        text : `Goodbye, ${name}. Hope to see you sometime soon`,
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
// to send email
// sgMail.send({
//     to : 'rohanshubhammitv@gmail.com',
//     from : 'rohanshubhammitv@gmail.com',
//     subject : 'This is my first creation',
//     text : 'Hope this one actually gets to you',
// });