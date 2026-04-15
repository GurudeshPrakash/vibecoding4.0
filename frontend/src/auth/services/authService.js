/**
 * Authentication Service
 * Handles API calls for login and other auth-related operations.
 */

const API_BASE_URL = 'http://localhost:5000/api';

const authService = {
    login: async (email, password) => {
        try {
            // Try Admin Login First
            let response = await fetch(`${API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                return await response.json();
            }

            // If not admin, try Staff Login
            response = await fetch(`${API_BASE_URL}/staff/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                // Map staff role explicitly if not returned
                return { ...data, role: 'staff' };
            }

            const errorData = await response.json();
            throw new Error(errorData.message || 'Invalid email or password');

        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_user');
        localStorage.removeItem('token');
        localStorage.removeItem('branchId');
    }
};

export default authService;

