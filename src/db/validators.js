const { z } = require("zod");

const lead = z.object({
    email: z.string().email(),
}); 
    
function validateLead(body) {
    let hasError = false;
    let validData = {}
    let message = ''

    try {
        validData = lead.parse(body)
     } catch (err) {
        hasError = true
        message = 'Invalid email, please try again'
    }
    
    return {
        data: validData,
        hasError,
        message
    }
}

module.exports = { validateLead };