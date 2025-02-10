import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow external access (CORS headers)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");  // ✅ Allow all external origins (Change * to a specific domain if needed)
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    
    next();
});

// ✅ Secure Redirect API (No need to specify external URL in `app.get`)
app.get("/api/redirect", (req, res) => {
    const SECRET_KEY = process.env.SECRET_KEY;
    const expires = req.query.expires;
    const receivedHash = req.query.hash;

    if (!expires || !receivedHash) {
        return res.status(403).json({ error: "Invalid or missing parameters" });
    }

    // ✅ Generate expected hash
    const expectedHash = crypto.createHmac("sha256", SECRET_KEY).update(expires.toString()).digest("hex");

    // ✅ Validate the hash and expiry time
    if (receivedHash !== expectedHash || Date.now() > parseInt(expires)) {
        return res.status(403).json({ error: "Link expired or tampered" });
    }

    // ✅ Redirect to external document URL (Public access allowed)
    const documentUrl = process.env.DOCUMENT_URL || "https://your-secure-doc-url.com/document.pdf";
    res.redirect(documentUrl);
});

// ✅ Start Express Server (Ensure Render uses correct PORT)
app.listen(PORT, () => {
    console.log(`✅ Redirect service running on port ${PORT}`);
});
