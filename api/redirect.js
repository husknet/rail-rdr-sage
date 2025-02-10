import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config(); // Load secret key

export default function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");

    const SECRET_KEY = process.env.SECRET_KEY;
    const expires = req.query.expires;
    const receivedHash = req.query.hash;

    if (!expires || !receivedHash) {
        return res.status(403).json({ error: "Invalid or missing parameters" });
    }

    // Recalculate the HMAC hash
    const expectedHash = crypto.createHmac("sha256", SECRET_KEY).update(expires.toString()).digest("hex");

    // Validate the hash and check expiration time
    if (receivedHash !== expectedHash || Date.now() > parseInt(expires)) {
        return res.status(403).json({ error: "Link expired or tampered" });
    }

    const documentUrl = "https://your-secure-doc-url.com/document.pdf"; // Replace with actual document location

    // Redirect user to the actual document
    res.writeHead(302, { Location: documentUrl });
    res.end();
}
