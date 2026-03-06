const rbac = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, no user info" });
        }

        const { role } = req.user;

        // Super Admin always has access to everything
        if (role === 'super_admin' || allowedRoles.includes(role)) {
            return next();
        }

        return res.status(403).json({ message: `Access denied: Insufficient permissions for role [${role}]` });
    };
};

module.exports = rbac;
