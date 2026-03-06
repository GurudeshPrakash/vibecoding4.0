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

/**
 * Check if the user is a super admin
 * @param {string} userRole 
 * @returns {boolean}
 */
export const isSuperAdmin = (userRole) => {
    return userRole === roles.SUPER_ADMIN;
};

/**
 * Check if the user is an admin or above
 * @param {string} userRole 
 * @returns {boolean}
 */
export const isAdmin = (userRole) => {
    return [roles.ADMIN, roles.SUPER_ADMIN].includes(userRole);
};
