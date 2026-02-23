import { useState, useCallback, useEffect } from 'react';
import { apiRequest } from '../utils/apiService';

/**
 * Custom hook for equipment data management.
 * High cohesion: All equipment-related state and logic is centralized here.
 * Low coupling: App component just uses the returned data and methods.
 */
export const useEquipmentData = (isAuthenticated, loginRole) => {
    const [inventoryData, setInventoryData] = useState([]);
    const [dismantleRequests, setDismantleRequests] = useState([]);
    const [dismantledHistory, setDismantledHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchInventory = useCallback(async (isPolling = false) => {
        if (!isAuthenticated || !loginRole) return;
        if (!isPolling) setIsLoading(true);

        const token = localStorage.getItem(`${loginRole}_token`);
        const result = await apiRequest('/equipment', 'GET', null, token);

        if (result.ok) {
            setInventoryData(result.data.map(item => ({
                ...item,
                id: item._id,
                customId: item.customId,
                name: item.name,
                category: item.category,
                status: item.status,
                serial: item.serial || item.serialNumber,
                area: item.area || item.location,
                photo: item.photo,
                specs: item.specs || {},
                maintenanceHistory: item.maintenanceHistory || [],
                warranty: item.warranty,
                createdAt: item.createdAt
            })));
        }
        if (!isPolling) setIsLoading(false);
    }, [isAuthenticated, loginRole]);

    const fetchPendingRequests = useCallback(async () => {
        if (!isAuthenticated || loginRole !== 'admin') return;
        const token = localStorage.getItem('admin_token');
        const result = await apiRequest('/equipment/pending-requests', 'GET', null, token);
        if (result.ok) setDismantleRequests(result.data);
    }, [isAuthenticated, loginRole]);

    const fetchDismantledHistory = useCallback(async () => {
        if (!isAuthenticated || !loginRole) return;
        const token = localStorage.getItem(`${loginRole}_token`);
        const result = await apiRequest('/equipment/dismantled-history', 'GET', null, token);
        if (result.ok) setDismantledHistory(result.data);
    }, [isAuthenticated, loginRole]);

    const finalizeDismantle = async (requestId) => {
        if (!requestId) return;
        if (!window.confirm('Confirm Physical Removal: Has this equipment been completely removed from the gym?')) return;

        const token = localStorage.getItem(`${loginRole}_token`);
        const result = await apiRequest(`/equipment/dismantle-finalize/${requestId}`, 'DELETE', null, token);

        if (result.ok) {
            alert('Record successfully cleared.');
            setDismantledHistory(prev => prev.filter(r => r._id !== requestId));
        } else {
            alert(`Error: ${result.data.message || 'Failed to clear record'}`);
        }
    };

    // Polling logic
    useEffect(() => {
        if (isAuthenticated && loginRole) {
            const poll = () => {
                fetchInventory(true);
                fetchPendingRequests();
                fetchDismantledHistory();
            };
            poll();
            const interval = setInterval(poll, 10000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, loginRole, fetchInventory, fetchPendingRequests, fetchDismantledHistory]);

    return {
        inventoryData,
        dismantleRequests,
        dismantledHistory,
        isLoading,
        refreshInventory: fetchInventory,
        finalizeDismantle,
        setInventoryData
    };
};
