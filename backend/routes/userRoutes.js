import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from "bcryptjs";
import User from '../model/userModel.js';
import {generateToken, isAuth} from "../utils.js";

const userRouter = express.Router();

userRouter.post(
    '/login',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if(req.body.isVerified === true)
            {
                // if (bcrypt.compareSync(req.body.password, user.password)) {
                    // if(toString(req.body.isVerified) === 'true')
                    // if(req.body.isVerified == true)
                    user.isVerified = req.body.isVerified;
                    user.save();
                    
                    res.send({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        address: user.address,
                        phone: user.phone,
                        dob: user.dob,
                        isVerified: user.isVerified,
                        token: generateToken(user)
                    });
                // }
                // else res.status(401).send({message: 'Mật khẩu không đúng'});
            }
            // else res.status(401).send({message: 'Email chưa xác nhận232'});
        }
        // else res.status(401).send({message: 'Email chưa đăng ký'});
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


userRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async (req,res) => {
        const user = await User.findById(req.user._id);
        if (user) {

            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.address = req.body.address || user.address;
            user.phone = req.body.phone || user.phone;
            user.dob = req.body.dob || user.dob;
            if (req.body.password) {
                user.password = bcrypt.hashSync(req.body.password, 8);
            }

            const updatedUser = await user.save();
            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                address: updatedUser.address,
                phone: updatedUser.phone,
                dob: updatedUser.dob,
                token: generateToken(updatedUser)
            });
        } else {
            res.status(404).send({ message: "User Not Found" });
        }
    })
)

userRouter.post(
    '/forget',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if(req.body.isVerified === true)
            {
                // if (bcrypt.compareSync(req.body.password, user.password)) {
                //     // if(toString(req.body.isVerified) === 'true')
                //     // if(req.body.isVerified == true)
                //     user.isVerified = req.body.isVerified;
                //     user.save();
                    
                //     res.send({
                //         _id: user._id,
                //         name: user.name,
                //         email: user.email,
                //         isAdmin: user.isAdmin,
                //         address: user.address,
                //         phone: user.phone,
                //         dob: user.dob,
                //         isVerified: user.isVerified,
                //         token: generateToken(user)
                //     });
                // }
                // else res.status(401).send({message: 'Mật khẩu không đúng'});
            }
            // else res.status(401).send({message: 'Email chưa xác nhận232'});
        }
        // else res.status(401).send({message: 'Email chưa đăng ký'});
    })
);

export default userRouter;