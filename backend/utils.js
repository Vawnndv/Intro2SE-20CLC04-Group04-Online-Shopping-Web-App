import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(user.toJSON(), process.env.JWT_SECRET,  {
       expiresIn: '30d',
    });
}