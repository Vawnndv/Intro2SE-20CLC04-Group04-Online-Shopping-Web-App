import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
    {
        name: {type: String, require: true, unique: true},
        code: {type: String, require: true, unique: true},
        description: {type: [String], require: true},
        discount: {type: Number, require: true},
        quantity: {type: Number, require: true},
    },
    {
        timestamps: true
    }
);

const Voucher = mongoose.model('Voucher', voucherSchema);
export default Voucher;