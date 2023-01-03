import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../model/orderModel.js';
import { isAdmin, isAuth } from '../utils.js';
import Product from "../model/productModel.js";
import Voucher from '../model/voucherModel.js';

const orderRouter = express.Router();
const PAGE_SIZE = 5;
orderRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        // const orders = await Order.find().populate('user', 'name');
        // res.send(orders);

        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || PAGE_SIZE;

        const orders = await Order.find().populate('user', 'name')
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        const countOrders = await Order.countDocuments();
        res.send({
            orders,
            countOrders,
            page,
            pages: Math.ceil(countOrders / pageSize),
        });
    })
);

orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
    const failItems = [];
    const orderedItems = req.body.orderItems;
    for (let i = 0; i < orderedItems.length; i++) {
        let product = await Product.findOne({ _id: orderedItems[i]._id });
        product = product.toObject();
        if (product.quantity - orderedItems[i].quantity < 0) {
            product.orderedQuantity = orderedItems[i].quantity;
            failItems.push(product);
        }
    }
    let voucher = await Voucher.findById(req.body.paymentInfo.voucher._id);

    if (failItems.length !== 0) {
        res.status(400).send({ message: 'ITEM_QUANTITY_ERROR', failItems });
    }
    else if (voucher.quantity < 1) {
        res.status(400).send({ message: 'VOUCHER_QUANTITY_ERROR', voucher })
    }
    else {
        const newOrder = new Order({
            orderItems: req.body.orderItems.map((item) => {
                return { ...item, product: item._id }
            }),
            shippingAddress: req.body.shippingAddress,
            paymentInfo: { ...req.body.paymentInfo },
            itemsPrice: req.body.itemsPrice,
            voucherSales: req.body.voucherSales,
            totalPrice: req.body.totalPrice,
            user: req.user._id
        });

        const order = await newOrder.save();

        res.status(201).send({ message: 'Đơn hàng đã được tạo', order });
    }
}
));

orderRouter.get(
    '/mine',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const orders = await Order.find({ user: req.user._id });
        res.send(orders);
    })
);

orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        res.send(order);
    } else {
        res.status(404).send({ message: 'Không tìm thấy đơn hàng' });
    }
}));

orderRouter.put(
    '/:id/deliver',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            order.isPaid = true;
            order.paidAt = Date.now();
            order.deliveredAt = Date.now();
            await order.save();
            res.send({ message: 'Đơn hàng đã hoàn thành' });
        } else {
            res.status(404).send({ message: 'Không tìm thấy đơn hàng' });
        }
    })
);

orderRouter.put(
    '/:id/pay',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById({ user: req.params.id });
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address
            };
            const updatedOrder = await order.save();
            res.send({ message: 'Order Paid', order: updatedOrder });
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    })
)

orderRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.remove();
            res.send({ message: 'Đã xóa đơn hàng' });
        } else {
            res.status(404).send({ message: 'Không tìm thấy đơn hàng' });
        }
    })
);

export default orderRouter;