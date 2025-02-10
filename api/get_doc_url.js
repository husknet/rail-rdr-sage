const crypto = require("crypto");
require("dotenv").config();

module.exports = function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

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
};
