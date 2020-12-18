import e from 'express';
import jwt from 'jsonwebtoken'
import User from '../model/User.js';

const protectRoute = async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        try{

            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('-password')

            next()
        }catch(error){
            res.status(401).json({"error" : "security key is missing or incorrect"})
            console.log(error)
            return
        }
    }else{
        res.status(401).json({"error" : "security key is missing or incorrect"})
        return
    }
}

export { protectRoute }