import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

    // ✅ Redirect to the actual document URL
    const documentUrl = process.env.DOCUMENT_URL || "https://fb.com";
    res.redirect(documentUrl);
});

// ✅ Start Express Server
app.listen(PORT, () => {
    console.log(`✅ Redirect service running on port ${PORT}`);
});
