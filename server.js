import express from 'express';
import cors from 'cors';
import ConnectToDB from './model/db.js';
import dotenv from 'dotenv';
import user from'./api/user.js';
import note from './api/note.js';

dotenv.config();



const app = express();

app.use(cors());
app.use(express.json({extended: false}))



app.use("/api/user", user);
app.use("/api/note", note);


//!Serve frontend... Remove comment when ready to deploy
//app.use(express.static('./view/build'));
//
//app.get('*', (req, res) => {
//    res.sendFile(path.resolve(__dirname, 'view', 'build', 'index.html'));
//})

ConnectToDB();
app.listen(5000, () => console.log("Server Started at port 5000"));
