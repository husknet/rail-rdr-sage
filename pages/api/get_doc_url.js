const SECURE_TOKEN = "a3c4d5e8f9a0b1c2d3e4f56789abcdef"; // Change this to your generated token

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const userToken = req.headers.authorization?.split("Bearer ")[1];
    if (userToken !== SECURE_TOKEN) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    const secureRedirectURL = `https://your-backend.com/redirect?expires=${Date.now() + 300000}`;

    res.status(200).json({ secure_url: secureRedirectURL });
}
