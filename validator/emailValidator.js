//TODO: Email validator needs to check SMTP email using Node mail server

const emailValidator = require('deep-email-validator');


module.exports = async function isEmailValid(email) {
    return await emailValidator.validate({
        email: email,
        // sender: email, // For testing SMTP node mail
        validateRegex: true,
        validateMx: true,
        validateTypo: true,
        validateDisposable: true,
        validateSMTP: false,
      })
}