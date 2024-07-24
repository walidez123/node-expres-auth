import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email:{
        type: 'string',
        required: true,
        unique: true
    },
    password:{
        type:'string',
        required: true,
        minlength: 8,
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }]
})
const User = mongoose.model('User',userSchema);
export default User;