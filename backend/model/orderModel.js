import mongoose from "mongoose";

const orderVoucherSchema = new mongoose.Schema(
    {
        name: { type: String, require: true},
        code: { type: String, require: true},
        discount: { type: Number, require: true},
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Voucher',
            required: false,
            require: true
        }
    }
);

const orderSchema = new mongoose.Schema(
    {
        orderItems: [
            {
                name: { type: String, require: true },
                slug: { type: String, require: true },
                quantity: { type: Number, require: true },
                image: { type: String, require: true },
                price: { type: Number, require: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                }
            }
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true }
        },
        paymentInfo: {
            paymentMethod: { type: String, required: true },
            voucher: {
                type: orderVoucherSchema, required: false, default: null
            }
        },
        paymentResult: {
            id: String,
            status: String,
            update_time: String,
            email_address: String
        },
        itemsPrice: { type: Number, required: true },
        voucherSales: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, default: false },
        deliveredAt: { type: Date }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;