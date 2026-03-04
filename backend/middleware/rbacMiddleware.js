const rbac = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, no user info" });
        }

        const { role } = req.user;

        // Support both naming conventions during transition if needed
        // but prioritize the guide's naming
        const normalizedRole = role === 'super_admin' ? 'superadmin' : (role === 'staff' ? 'manager' : role);

        if (!allowedRoles.includes(normalizedRole)) {
            return res.status(403).json({ message: `Access denied: Required roles [${allowedRoles.join(', ')}]` });
        }
        next();
    };
};

module.exports = rbac;
