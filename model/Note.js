import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
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