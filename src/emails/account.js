const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = async (facultyEmail, studentEmail, name, year, branch, clgName, purpose) => {
    await sgMail.send({
        to: facultyEmail,
        from: 'guptapurushottam123@gmail.com',
        subject: 'REGARDING MENTORSHIP',
        text: `Respected Sir/Madam,
        I'm ${name} , ${year} year ${branch} student of ${clgName}. This is to request you to be my mentor for ${purpose}. You can mail me your response on ${studentEmail} email Id.`
    })
}

module.exports = sendWelcomeEmail
