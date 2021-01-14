import jwt from 'jsonwebtoken';
import User from '../model/User';

const authorize = async (req, res, next) => {
    try {

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            
            let token = req.headers.authorization.split(' ')[1]

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decodedToken.id).select('-password')

            next()

        }else{
            throw "No token present please login"
        }

    } catch (error) {
        console.log(`Error occured at authorize machine ${error}`)
        return res.status(401).json({ "error": error })
    }
}

export { authorize }