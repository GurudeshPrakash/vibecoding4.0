/**
 * Admin Service for Super Admin tasks.
 */
export const adminService = {
    /**
     * Get all branch administrators
     */
    getAdministrators: async () => {
        const raw = localStorage.getItem('mock_admins_db');
        return raw ? JSON.parse(raw) : [];
    },

    /**
     * Create a new administrator
     */
    createAdministrator: async (adminData) => {
        const admins = await adminService.getAdministrators();
        const newAdmin = { ...adminData, id: Date.now() };
        localStorage.setItem('mock_admins_db', JSON.stringify([...admins, newAdmin]));
        return newAdmin;
    }
};
