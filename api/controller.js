import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../model/User.js';
import Note from '../model/Note.js';
import dotenv from 'dotenv';
import Cryptr from 'cryptr';
import { post } from 'request';
dotenv.config();

const secret = process.env.JWT_SECRET;


class controller {

static async checkToken(req, res){
    try{
        const token = req.header('x-auth-token');

        if(!token){
            return res.status(402).json({"error" : "Session expired... please login again"})
        }

        const decoded = jwt.verify(token, secret);
        req.user = decoded.user
        return "OK";
    }catch(error){
        console.log("Error occured" + error);
        res.status(402).json({"error" : "Session has been tampered with... please login again"})
        return "Not OK"
        //401 unathorized... 402 payment required (lol)
    }
}


static async register(req, res){
    try{

        if(!req.body.username || !req.body.password){
            return res.status(400).json({"error" : "username or password has not been provided"})
        }
        const { username, password } = req.body;

        let user = await User.findOne({username});

        if(user){
            return res.status(400).json({"error" : "user already exists"})
        }

        user = new User({
            username,
            password
        })

        //encryption

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save()

        //return token

        const payload = {
            user: {
               id: user.id 
            }
        }
        jwt.sign(
            payload,
            secret,
            { expiresIn: 3600000}, //1000 hours or like 40 days
            (error, token) => {
                if(error) throw error;
                res.json({ 
                    token,
                    "notekey" : password 
                });
            }
        );
        
    }catch(error){
        console.log(`Error occured ${error}`)
        res.status(500).send("Server error occured" + error)
    }
}

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

        const payload = {
            user:{
                id: user.id,
            }
        }
        jwt.sign(
            payload,
            secret,
            { expiresIn: 3600000 },
            (error, token) => {
                if(error) throw error;
                res.json({ 
                    token,
                    "notekey" : password 
                });
            }
        );
    }catch(error){
        console.log(`Error occured ${error}`)
        res.status(500).json({"error" : "Server error please try again LATER"})
    }
}

static async createNote(req, res){
    try{
        const authResult = this.checkToken()

        if(authResult !== "OK"){
            res.status(401).json({"error" : "User is not logged in!"})
        }

        if(!req.body.notetitle || !req.body.notetext){
            return res.status(400).json({"error" : "Title or text has not been provided"})
        }

        const {notetitle, notetext} = req.body;

        //const user = await User.findById(req.user.id).select('-password');

        const keyy = req.header('x-encryption-key')

        const cryptr = new Cryptr(keyy)


        //encrypt notes
        const encryptedTitle = cryptr.encrypt(notetitle);
        const encryptedNote = cryptr.encrypt(notetext);

        const newNote = new Note ({
            user: req.user.id,
            userId: req.user.id,
            encryptedTitle,
            encryptedNote
        });

        const note = await newNote.save();
        res.json({"msg" : "Note has been uploaded"});
    }catch(error){
        console.log(`Error occured ${error}`)
        res.status(500).json({"error" : "Server error"})
    }
}

static async viewNotes(req, res){
    try{
        const authResult = this.checkToken()

        if(authResult !== "OK"){
            res.status(401).json({"error" : "User is not logged in!"})
        }

        const notes = await Note.find({userId : req.user.id});

        const keyy = req.header('x-encryption-key')

        const cryptr = new Cryptr(keyy)

        for(i = 0; i < notes.length; i++);
        {
            notes[i].notetext = cryptr.decrypt(notes[i].notetext);
            notes[i].notetitle = cryptr.decrypt(notes[i].notetitle);
        }

        res.json(notes);

        //const isMatch = await bcrypt.compare(password, user.password)
    }catch(error){
        console.log(`Error occured ${error}`)
        res.status(500).json({"error" : "Server error when gathering notes"})
    }
}

static async editNote(req, res){
    try{
        const authResult = this.checkToken()

        if(authResult !== "OK"){
            res.status(401).json({"error" : "User is not logged in!"})
        }
        const note = await Note.findById(req.params.id);

        if(note.userId !== req.user.id){
            res.status(401).json({"error" : "Note does not belong to user"})
        }

        const cryptr = new Cryptr(req.user.key)

        const {newNotetitle, newNotetext} = req.body;

        const encryptedTitle = cryptr.encrypt(newNotetitle);
        const encryptedNote = cryptr.encrypt(newNotetext);

        note.notetitle = encryptedTitle;
        note.notetext  = encryptedNote;

        await note.save();

        res.json({"msg" : "Note has been edited"})

    }catch(error){
        console.log(`Error occured ${error}`)
        res.status(500).json({"error" : "Server error when editing note"})
    }
}

static async deleteNote(req, res){
    try{
        const authResult = this.checkToken()
        
        if(authResult !== "OK"){
            res.status(401).json({"error" : "User is not logged in!"})
        }

        const note = await Note.findById(req.params.id);

        if(note.userId !== req.user.id){
            res.status(401).json({"error" : "Note does not belong to user"})
            return
        }


        await note.remove();

        res.json({"msg" : "note removed"})


    }catch(error){
        console.log(`Error occured ${error}`)
        res.status(500).json({"error" : "Server error when deleting note"})
    }
}

static async viewNote(req, res){
    try{
        const authResult = this.checkToken()

        if(authResult !== "OK"){
            res.status(401).json({"error" : "User is not logged in!"})
        }

        const note = await Note.findById(req.params.id);

        if(note.userId !== req.user.id){
            res.status(401).json({"error" : "Note does not belong to user"})
            return
        }


        const cryptr = new Cryptr(req.user.key)

        note.notetext = cryptr.decrypt(note.notetext);
        note.notetitle = cryptr.decrypt(note.notetitle);

        res.json(note)


    }catch(error){
        console.log(`Error occured ${error}`)
        res.status(500).json({"error" : "Server error when viewing note"})
    }
}

static async deleteAccount(req, res){
    try{
        const authResult = this.checkToken()

        if(authResult !== "OK"){
            res.status(401).json({"error" : "User is not logged in!"})
        }

        const user = await User.findById(req.params.id)

        const isMatch = await bcrypt.compare(req.body.password, user.password)

        if(!isMatch){
            return res.status(400).json({"error" : "Username And/Or password is invalid"})
        }

        

        await user.remove();

    }catch(error){
        console.log(`Error occured ${error}`)
        res.status(500).json({"error" : "Server error when deleting note"})
    }
}

static async testRoute(req, res){
    try{
        const authResult = this.checkToken()

        if(authResult !== "OK"){
            res.status(401).json({"error" : "User is not logged in!"})
        }

        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    }catch(error){
        console.log(`Error occured ${error}`)
        res.status(500).json({"error" : "Server error occured PLEASE try again LATER"})
    }
}

}

export default controller;