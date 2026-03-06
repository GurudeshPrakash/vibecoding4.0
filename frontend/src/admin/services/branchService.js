import { ADMIN_BRANCHES } from '../constants/mockData';

/**
 * Branch Service handles API communication for branch-related data.
 */
export const branchService = {
    /**
     * Fetch all branches
     */
    getBranches: async () => {
        // In a real app: return axios.get('/api/admin/branches');
        return ADMIN_BRANCHES;
    },

    /**
     * Get branch by ID
     */
    getBranchById: async (id) => {
        return ADMIN_BRANCHES.find(b => b._id === id);
    },

    /**
     * Update branch data
     */
    updateBranch: async (id, data) => {
        console.log(`Updating branch ${id} with:`, data);
        return { success: true };
    }
};
