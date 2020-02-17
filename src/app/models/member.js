const mongoose = require('../../database/index');

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    occupation: {
        type: String,
        require: true,
    },
    avatar: { 
        type: Object,
        required: true,
    }
});

const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;