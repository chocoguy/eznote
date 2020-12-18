import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const db = process.env.DB_URI;

console.log(db)
const ConnectToDB = async () => {
    try{
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Database successfully connected!');
    }catch(error){
        console.log('Error occured at db.js ' + error);
    }
}

export default ConnectToDB;


