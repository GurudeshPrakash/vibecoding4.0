import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Use sessionStorage to allow multiple roles in different tabs simultaneously
        const savedUser = sessionStorage.getItem("admin_user");
        const token = sessionStorage.getItem("admin_token");

        if (savedUser && token) {
            try {
                const parsedUser = JSON.parse(savedUser);
                // STRICT CHECK: Ensure user has a valid role and the data persists correctly
                const validRoles = ['super_admin', 'admin', 'staff'];
                if (parsedUser && parsedUser.role && validRoles.includes(parsedUser.role.toLowerCase())) {
                    setUser(parsedUser);
                } else {
                    console.error("Invalid session role detected, clearing session.");
                    logout();
                }
            } catch (e) {
                console.error("Session corruption detected, clearing.");
                logout();
            }
        } else {
            // Ensure state is clean if no session exists or was deleted
            setUser(null);
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        // Store both as per current architecture but ensure consistent usage
        setUser(userData);
        sessionStorage.setItem("admin_token", token);
        sessionStorage.setItem("admin_user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem("admin_token");
        sessionStorage.removeItem("admin_user");
        authService.logout();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
            {/* Prevent flickering of unauthorized content by only rendering children after load */}
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

