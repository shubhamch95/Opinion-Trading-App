const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.user || decoded.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token is not valid" });
    }
};
