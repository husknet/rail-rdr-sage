export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const expires = req.query.expires;

    if (!expires || Date.now() > parseInt(expires)) {
        return res.status(403).json({ error: "Link expired" });
    }

    const documentUrl = "https://your-secure-doc-url.com/document.pdf"; // Replace with actual document location

    res.writeHead(302, { Location: documentUrl });
    res.end();
}
