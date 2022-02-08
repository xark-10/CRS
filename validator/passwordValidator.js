//TODO: Password validator needs to handle more blacklisted password

var passwordValidator = require('password-validator')
 
// Create a schema
var passwordSchema = new passwordValidator();


// Add properties to it
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digits
.has().symbols()                               // Must have at least 1 symbol
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values // should short list common passwords from a file feature in coming 

module.exports = ("passwordSchema", passwordSchema);