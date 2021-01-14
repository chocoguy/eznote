import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    userId:{
        type: String,
        required: true,
    },
    noteKey: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

export default User;