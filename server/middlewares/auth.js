const jwt = require("jsonwebtoken");

module.exports.authAdmin = (req, res, next) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : "";

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        if (userInfo.role !== "admin") {
            throw new Error("Permission is denied");
        }
        next();
    } catch (err) {
        res.status(401).send(err.message);
    }
};

module.exports.authAdminTeacher = (req, res, next) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : "";

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        if (userInfo.role !== "admin" && userInfo !== "teacher") {
            throw new Error("Permission is denied");
        }
        next();
    } catch (err) {
        res.status(401).send(err.message);
    }
};
