const mongoose = require("mongoose");


//create a data schema
const User = mongoose.model('User', {
    Email: String,
    Senha: String,
})

module.exports = User;