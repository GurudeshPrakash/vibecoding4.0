const rbac = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, no user info" });
        }

        const { role } = req.user;

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ message: `Access denied: Insufficient permissions for role [${role}]` });
        }
        next();
    };
};

module.exports = rbac;
