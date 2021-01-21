import bcrypt from 'bcryptjs';
import User from '../model/User.js';
import Note from '../model/Note.js';
import dotenv from 'dotenv';
import Cryptr from 'cryptr';
import  genToken  from './tokenMachine.js';
import makeId from './makeId.js'
dotenv.config();




class controller {

// static async checkToken(req, res){
//     try{
//         const token = req.header('x-auth-token');

//         if(!token){
//             return res.status(402).json({"error" : "Session expired... please login again"})
//         }

//         const decoded = jwt.verify(token, secret);
//         req.user = decoded.user
//         return "OK";
//     }catch(error){
//         console.log("Error occured" + error);
//         res.status(402).json({"error" : "Session has been tampered with... please login again"})
//         return "Not OK"
//         401 unathorized... 402 payment required (lol)
//     }
// }

// Ctrl + / so you can comment all at once


// http://example.com/api/user/register
//OK
static async register(req, res, next){
    try{

        if(!req.body.username || !req.body.password){
            return res.status(400).json({"error" : "username or password has not been provided"})
        }
        const { username} = req.body;

        let user = await User.findOne({username});

        if(user){
            return res.status(400).json({"error" : "user already exists"})
        }

        //encryption

        const salt = await bcrypt.genSalt(10);

        let password = await bcrypt.hash(req.body.password, salt);


        let userId = makeId(7)
        let noteKey = makeId(9)

        let uploadedUser = await User.create({
            username,
            userId,
            noteKey,
            password,
            
        })

        let newToken = await genToken(uploadedUser._id, uploadedUser.userId, uploadedUser.noteKey)

    
        if(uploadedUser) {
            res.status(201).json({
                _id: uploadedUser._id,
                userId: uploadedUser.userId,
                noteKey: uploadedUser.noteKey,
                username: uploadedUser.username,
                token: newToken
            })
        }else{
            throw "Register user failure please try again later"
        }

        
    }catch(error){
        console.log(`Error occured at register ${error}`)
        return res.status(500).json({"error" : error})
    }
}

// http://example.com/api/user/login
//OK
static async login(req, res){
    try{

        if(!req.body.username || !req.body.password){
            return res.status(400).json({"error" : "username or password has not been provided"})
        }

        const {username, password} = req.body;

        let user = await User.findOne({username})

        if(!user){
            return res.status(400).json({"error" : "Username And/Or password is invalid"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({"error" : "Username And/Or password is invalid"})
        }

        res.json({
            _id: user._id,
            userId: user.userId,
            noteKey: user.noteKey,
            username: user.username,
            token: genToken(user._id, user.userId, user.noteKey)
        })

    }catch(error){
        console.log(`Error occured at login ${error}`)
        res.status(500).json({"error" : "Server error please try again LATER"})
    }
}

//http://localhost:5000/api/note/createnote
// OK
static async createNote(req, res){
    try{
        
        

        if(!req.body.notetitle || !req.body.notetext){
            return res.status(400).json({"error" : "Title or text has not been provided"})
        }



        const cryptr = new Cryptr(req.user.noteKey)

        //encrypt notes
        const encryptedTitle = cryptr.encrypt(req.body.notetitle);
        const encryptedNote = cryptr.encrypt(req.body.notetext);

        const newNote = new Note ({
            userId: req.user.userId,
            notetext: encryptedTitle,
            notetitle: encryptedNote
        });

        const createdNote = await newNote.save();
        res.json(createdNote);
    }catch(error){
        console.log(`Error occured createNote ${error}`)
        res.status(500).json({"error" : "Server error when creating note"})
    }
}

//http://localhost:5000/api/note/viewnotes
// OK
static async viewNotes(req, res){
    try{

        const notes = await Note.find({userId : req.user.userId});

        const cryptr = new Cryptr(req.user.noteKey)

        notes.map(note => {
            note.notetext = cryptr.decrypt(note.notetext)
            note.notetitle = cryptr.decrypt(note.notetitle)
        })

//        for(i = 0; i < notes.length; i++);
//        {
//            notes[i].notetext = cryptr.decrypt(notes[i].notetext);
//            notes[i].notetitle = cryptr.decrypt(notes[i].notetitle);
//        }

        res.json(notes);


    }catch(error){
        console.log(`Error occured viewnotes ${error}`)
        res.status(500).json({"error" : "Server error when gathering notes"})
    }
}

//http://localhost:5000/api/note/editnote/3736
// OK
static async editNote(req, res){
    try{

        const note = await Note.findById(req.params.id);

        if(note.userId !== req.user.userId){
            return res.status(401).json({"error" : "Note does not belong to user"})
        }

        const cryptr = new Cryptr(req.user.noteKey)

        const {newNotetitle, newNotetext} = req.body;

        const encryptedTitle = cryptr.encrypt(newNotetitle);
        const encryptedNote = cryptr.encrypt(newNotetext);

        note.notetitle = encryptedTitle;
        note.notetext  = encryptedNote;

        await note.save();

        res.json(note)

    }catch(error){
        console.log(`Error occured ${error}`)
        res.status(500).json({"error" : "Server error when editing note"})
    }
}


// OK
static async deleteNote(req, res){
    try{

        const note = await Note.findById(req.params.id);

        if(note.userId !== req.user.userId){
            return res.status(401).json({"error" : "Note does not belong to user"})
        }


        await note.remove();

        res.json({"msg" : "note removed"})


    }catch(error){
        console.log(`Error occured delete note ${error}`)
        res.status(500).json({"error" : "Server error when deleting note"})
    }
}

//http://localhost:5000/api/note/viewnote/3736
// OK
static async viewNote(req, res){
    try{

        const note = await Note.findById(req.params.id);

        if(note.userId !== req.user.userId){
            return res.status(401).json({"error" : "Note does not belong to user"})
        }


        const cryptr = new Cryptr(req.user.noteKey)

        note.notetext = cryptr.decrypt(note.notetext);
        note.notetitle = cryptr.decrypt(note.notetitle);

        res.json(note)


    }catch(error){
        console.log(`Error occured viewNotw ${error}`)
        res.status(500).json({"error" : "Server error when viewing note"})
    }
}

//http://localhost:5000/api/user/deleteacc
//! OK
static async deleteAccount(req, res){
    try{

        const user = await User.findById(req.user.id)


  

        const isMatch = await bcrypt.compare(req.body.password, user.password)

        if(!isMatch){
            return res.status(400).json({"error" : "Username And/Or password is invalid"})
        }
        await user.remove();
        res.json({"msg" : "user removed"})
    }catch(error){
        console.log(`Error occured ${error}`)
        res.status(500).json({"error" : "Server error when deleting note"})
    }
}

// OK
static async testRoute(req, res){
    try{

        //const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({"Helllo": "Welcome to backend"});

    }catch(error){
        console.log(`Error occured testroute ${error}`)
        res.status(500).json({"error" : "Server error occured PLEASE try again LATER"})
    }
}

}

export default controller;