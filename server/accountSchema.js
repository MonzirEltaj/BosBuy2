const mongoose = require("mongoose");

const options = { discriminatorKey: 'type' }; 

const accountSchema = new mongoose.Schema({
    name: String,
    password: String,
}, options);

const Account = mongoose.model('Account', accountSchema);

const User = Account.discriminator('User', new mongoose.Schema({
    firstName: String,
    lastName: String
}, options));

const Company = Account.discriminator('Company', new mongoose.Schema({
}, options));

module.exports = { Account, User, Company };