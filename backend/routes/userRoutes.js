import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from "bcryptjs";
import User from '../model/userModel.js';
import {generateToken} from "../utils.js";

const userRouter = express.Router();

userRouter.post(
    '/login',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    address: user.address,
                    phone: user.phone,
                    dob: user.dob,
                    token: generateToken(user)
                });
            }
        }
        else res.status(401).send({message: 'Email hoặc mật khẩu không đúng'});
    })
);


userRouter.post(
    '/register',
    expressAsyncHandler(async(req, res) => {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
            address: req.body.address,
            phone: req.body.phone,
            dob: req.body.dob
        });
        const user = await newUser.save();
        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            address: user.address,
            phone: user.phone,
            dob: user.dob,
            token: generateToken(user)
        });
    })
);
export default userRouter;