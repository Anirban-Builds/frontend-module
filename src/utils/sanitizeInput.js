export const sanitizeInput = (str) => str?.
trim().
toLowerCase().
replace(/[^a-z]/g, ' ')