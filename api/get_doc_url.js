import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Enable CORS for Azure Edge
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://azurerdr.z19.web.core.windows.net"); // Allow only Azure Edge
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
    const secureRedirectURL = `/api/redirect?expires=${expires}&hash=${hash}`;

    res.status(200).json({ secure_url: secureRedirectURL });
});

// ✅ Secure Redirect API
app.get("/api/redirect", (req, res) => {
    const SECRET_KEY = process.env.SECRET_KEY;
    const expires = req.query.expires;
    const receivedHash = req.query.hash;

    if (!expires || !receivedHash) {
        return res.status(403).json({ error: "Invalid or missing parameters" });
    }

    const expectedHash = crypto.createHmac("sha256", SECRET_KEY).update(expires.toString()).digest("hex");

    if (receivedHash !== expectedHash || Date.now() > parseInt(expires)) {
        return res.status(403).json({ error: "Link expired or tampered" });
    }

    const documentUrl = "https://your-secure-doc-url.com/document.pdf";
    res.redirect(documentUrl);
});

// ✅ Start Express Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
