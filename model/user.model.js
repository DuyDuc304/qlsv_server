const mongoose = require("mongoose");

const UserShema = mongoose.Schema({
    name: String,
    user: String,
    pass: String,
    calendar: Array,
    note: Array,
    notice: Array,
    coin: Object,

});

module.exports = mongoose.model('user', UserShema);