import jwt from 'jsonwebtoken';

const genToken = (id, userId, noteKey) => {
    return jwt.sign({ id, userId, noteKey }, process.env.JWT_SECRET, {
        expiresIn: '32d'
    })
}

export default {genToken}