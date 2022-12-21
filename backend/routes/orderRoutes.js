import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../model/orderModel.js';
import { isAuth } from '../utils.js';

const orderRouter = express.Router();

orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
        orderItems: req.body.orderItems.map((item) => {
            return { ...item, product: item._id }
        }),
        shippingAddress: req.body.shippingAddress,
        paymentInfo: req.body.paymentInfo,
        itemsPrice: req.body.itemsPrice,
        voucherSales: req.body.voucherSales,
        totalPrice: req.body.totalPrice,
        user: req.user._id
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'Đơn hàng đã được tạo', order });
}));

orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        res.send(order);
    } else {
        res.status(404).send({message: 'Không tìm thấy đơn hàng'});
    }
}));

export default orderRouter;