import express from 'express';
import dotenv from 'dotenv';
import router from './routes/routes.js';
import cors from 'cors';

dotenv.config();
const app= express();
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use("/api/utils", router);

app.listen(process.env.PORT, ()=>{
    console.log(` Utils Server is running on port ${process.env.PORT}`);
})