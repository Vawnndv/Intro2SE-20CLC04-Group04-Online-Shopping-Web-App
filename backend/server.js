import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import data from './data.js';
import seedRouter from "./routes/seedRoutes.js";
import ProductRoutes from "./routes/productRoutes.js";
import UserRoutes from "./routes/userRoutes.js";

dotenv.config();

mongoose.connect(process.env.MOGODB_URI)
    .then(() => {
        console.log('connected to db')
    }).catch(err => {
        console.log(err.message);
    });


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/seed', seedRouter);
app.use('/api/products', ProductRoutes);
app.use('/api/users', UserRoutes);

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`)
})