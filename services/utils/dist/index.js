import express from "express";
import dotenv from "dotenv";
import router from "./routes/routes.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
const { CLOUD_NAME, API_KEY, API_SECRET, PORT } = process.env;
if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error("Missing Cloudinary environment variables");
}
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/utils", router);
app.listen(PORT || 5000, () => {
    console.log(`Utils Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map