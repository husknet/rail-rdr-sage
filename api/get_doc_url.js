import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config(); // Load secret key from .env file

export default function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const SECURE_TOKEN = process.env.SECURE_TOKEN;
    const SECRET_KEY = process.env.SECRET_KEY; // Used for hashing
    const userToken = req.headers.authorization?.split("Bearer ")[1];

    if (userToken !== SECURE_TOKEN) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    // Generate expiration time (10 seconds from now)
    const expires = Date.now() + 10000;

    // Create HMAC hash of expiration timestamp
    const hash = crypto.createHmac("sha256", SECRET_KEY).update(expires.toString()).digest("hex");

    // Generate secure redirect URL
    const secureRedirectURL = `/api/redirect?expires=${expires}&hash=${hash}`;

    res.status(200).json({ secure_url: secureRedirectURL });
}
