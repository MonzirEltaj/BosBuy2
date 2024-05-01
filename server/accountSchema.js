const mongoose = require("mongoose");

const options = { discriminatorKey: 'type' }; // Our discriminator key

const accountSchema = new mongoose.Schema({
    name: String,
    password: String,
}, options);

const Account = mongoose.model('Account', accountSchema);

// For user-specific fields
const User = Account.discriminator('User', new mongoose.Schema({
    firstName: String,
    lastName: String
}, options));

// For company-specific fields
const Company = Account.discriminator('Company', new mongoose.Schema({
    // Company specific fields can be added here
}, options));

module.exports = { Account, User, Company };