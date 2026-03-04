import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("staff_user");
        const token = localStorage.getItem("staff_token");
        if (savedUser && token) {
            try {
                const parsedUser = JSON.parse(savedUser);
                // Normalize role for RBAC logic
                const normalizedRole = parsedUser.role === 'staff' ? 'manager' : (parsedUser.role === 'super_admin' ? 'superadmin' : parsedUser.role);
                setUser({ ...parsedUser, role: normalizedRole });
            } catch (e) {
                console.error("Failed to parse saved user", e);
                localStorage.removeItem("staff_user");
                localStorage.removeItem("staff_token");
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        const normalizedRole = userData.role === 'staff' ? 'manager' : (userData.role === 'super_admin' ? 'superadmin' : userData.role);
        const userToSave = { ...userData, role: normalizedRole };
        setUser(userToSave);
        localStorage.setItem("staff_token", token);
        localStorage.setItem("staff_user", JSON.stringify(userToSave));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("staff_token");
        localStorage.removeItem("staff_user");
        localStorage.removeItem("staff_current_log");
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
