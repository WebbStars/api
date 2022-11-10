const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.vaga = require("./vaga.model")

db.ROLES = ["user", "aupair", "family"];

module.exports = db;