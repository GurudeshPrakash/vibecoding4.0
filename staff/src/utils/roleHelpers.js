/**
 * RBAC Helper functions for frontend permission checks
 */

export const roles = {
    SUPER_ADMIN: 'superadmin',
    ADMIN: 'admin',
    MANAGER: 'manager'
};

/**
 * Check if a user role has permission to access a specific feature
 * @param {string} userRole - The normalized role of the user
 * @param {string[]} allowedRoles - Array of roles that are allowed
 * @returns {boolean}
 */
export const hasPermission = (userRole, allowedRoles) => {
    if (!userRole || !allowedRoles) return false;
    return allowedRoles.includes(userRole);
};
