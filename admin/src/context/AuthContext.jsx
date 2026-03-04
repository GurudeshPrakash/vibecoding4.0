import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("admin_user");
        const token = localStorage.getItem("admin_token");
        if (savedUser && token) {
            try {
                const parsedUser = JSON.parse(savedUser);
                // Normalize role for RBAC logic
                const normalizedRole = parsedUser.role === 'super_admin' ? 'superadmin' : (parsedUser.role === 'staff' ? 'manager' : parsedUser.role);
                setUser({ ...parsedUser, role: normalizedRole });
            } catch (e) {
                console.error("Failed to parse saved user", e);
                localStorage.removeItem("admin_user");
                localStorage.removeItem("admin_token");
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        const normalizedRole = userData.role === 'super_admin' ? 'superadmin' : (userData.role === 'staff' ? 'manager' : userData.role);
        const userToSave = { ...userData, role: normalizedRole };
        setUser(userToSave);
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_user", JSON.stringify(userToSave));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        localStorage.removeItem("admin_current_log");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
