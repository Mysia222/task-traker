const crypto = require('crypto').randomBytes(256).toString('hex');

// Export config object
module.exports = {
    uri: "mongodb://localhost:27017/" + this.db,
    secret: crypto, // Cryto-created secret
    db: 'traker' // Database name
}