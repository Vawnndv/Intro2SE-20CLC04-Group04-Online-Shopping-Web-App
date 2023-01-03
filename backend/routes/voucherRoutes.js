import express from "express";
import Voucher from "../model/voucherModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin, toRegex } from "../utils.js";

const voucherRouter = express.Router();

voucherRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newVoucher = new Voucher({
      name: "sample name" + Date.now(),
      code: "sample code" + Date.now(),
      discount: 0,
      quantity: 0,
      description: "sample description",
    });
    const voucher = await newVoucher.save();
    res.send({ message: "Voucher Created", voucher });
  })
);

voucherRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const voucherId = req.params.id;
    const voucher = await Voucher.findById(voucherId);
    if (voucher) {
      voucher.name = req.body.name;
      voucher.code = req.body.code;
      voucher.discount = req.body.discount;
      voucher.quantity = req.body.quantity;
      voucher.description = req.body.description;
      await voucher.save();
      res.send({ message: "Voucher đã được cập nhật" });
    } else {
      res.status(404).send({ message: "Không tìm thấy voucher" });
    }
  })
);

voucherRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const voucher = await Voucher.findById(req.params.id);
    if (voucher) {
      await voucher.remove();
      res.send({ message: "Đã xóa voucher" });
    } else {
      res.status(404).send({ message: "Không tìm thấy voucher" });
    }
  })
);

const PAGE_SIZE = 4;

voucherRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const vouchers = await Voucher.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countVouchers = await Voucher.countDocuments();
    res.send({
      vouchers,
      countVouchers,
      page,
      pages: Math.ceil(countVouchers / pageSize),
    });
  })
);

voucherRouter.get("/all", async (req, res) => {
 const vouchers = await Voucher.find({quantity: {$gt: 0}});
 res.send(vouchers);
});

voucherRouter.get("/:id", async (req, res) => {
  const voucher = await Voucher.findById(req.params.id);
  if (voucher) {
    res.send(voucher);
  } else {
    res.status(404).send({ message: "Voucher Not Found" });
  }
});

voucherRouter.patch(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const voucherId = req.params.id;
    const count = await Voucher.updateOne({ _id: voucherId }, req.body);
    if (count.modifiedCount)
      res.status(200).send({ message: "Voucher quantity reduced" });
    else if (!count.matchedCount)
      res.status(404).send({ message: "Voucher Not Found" });
    else res.status(400).send({ message: "Uncaught error" });
  })
);

export default voucherRouter;
