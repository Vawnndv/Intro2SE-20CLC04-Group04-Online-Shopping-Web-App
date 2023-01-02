import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from "bcryptjs";
import User from '../model/userModel.js';
import {generateToken, isAdmin, isAuth} from "../utils.js";
import Product from "../model/productModel.js";
import productRouter from "./productRoutes.js";

const userRouter = express.Router();
const PAGE_SIZE = 5;
userRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        // const users = await User.find({});
        // res.send(users);
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || PAGE_SIZE;

        const users = await User.find({})
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        const countUsers = await User.countDocuments();
        res.send({
            users,
            countUsers,
            page,
            pages: Math.ceil(countUsers / pageSize),
        });
    })
)

userRouter.get(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({message: 'Không tìm thấy người dùng'});
        }
    })
)

userRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.isAdmin = Boolean(req.body.isAdmin);

            const updateUser = await user.save();
            res.send({message : 'Người dùng đã được cập nhật'});
        } else {
            res.status(404).send({message: 'Không tìm thấy người dùng'});
        }
    })
);

userRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req,res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.email === 'admin@gmail.com') {
                res.status(400).send({message: 'Không thể xóa tài khoản admin này'});
                return;
            }
            await user.remove();
            res.send({ message: 'Đã xóa người dùng'});
        } else {
            res.status(404).send({ message: 'Không tìm thấy người dùng'});
        }
    })
);

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
            user.email = req.body.newEmail || user.email;
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