/**
 * Authentication Service
 * Handles API calls for login and other auth-related operations.
 */

const API_BASE_URL = 'http://localhost:5000/api';

const authService = {
    login: async (email, password) => {
        // In a real production system, this would be a real API call
        // For now, we simulate the authentication with role-based logic

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let role = 'staff';
                let firstName = 'Staff';

                // Simulation based on email patterns
                if (email.includes('alex')) {
                    role = 'super_admin';
                    firstName = 'Alex (SA)';
                } else if (email.includes('daniel')) {
                    role = 'admin';
                    firstName = 'Daniel (Admin)';
                } else if (email.includes('nimal')) {
                    role = 'staff';
                    firstName = 'Nimal (Staff)';
                } else if (email !== '' && password !== '') {
                    // Default fallback for any input
                    role = 'staff';
                    firstName = 'Test User';
                } else {
                    return reject(new Error('Invalid credentials'));
                }

                const mockUser = {
                    token: 'mock-jwt-token-' + Date.now(),
                    firstName: firstName,
                    lastName: 'User',
                    email: email,
                    role: role,
                    phone: '+94 77 123 4567'
                };

                resolve(mockUser);
            }, 1000);
        });
    },

    logout: () => {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_user');
    }
};

export default authService;

