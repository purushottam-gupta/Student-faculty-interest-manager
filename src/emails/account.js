const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = async (facultyEmail, studentEmail, name, year, branch, clgName, purpose, idea) => {
    await sgMail.send({
        to: facultyEmail,
        from: 'guptapurushottam123@gmail.com',
        subject: 'REGARDING MENTORSHIP',
        text: `Respected Sir/Madam,
        I'm ${name} , ${year} year ${branch} student of ${clgName}. This is to request you to be my mentor for ${purpose}.My tentaive project idea is ${idea}.
        You can mail me your response on ${studentEmail} email Id.

        Thank you
        ${name}`
    })
}

module.exports = sendWelcomeEmail
