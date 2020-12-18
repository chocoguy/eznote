import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    userId:{
        type: String,
        required: true,
    },
    notetitle: {
        type: String,
        required: true
    },
    notetext: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Note = mongoose.model('Note', noteSchema);

export default Note;