import { useMemo } from 'react';

/**
 * Custom hook to calculate admin dashboard statistics.
 * Separating logic from UI components improves maintainability.
 */
export const useAdminStats = (inventoryData, dismantledHistory) => {
    return useMemo(() => {
        return {
            total: inventoryData.length,
            good: inventoryData.filter(i => i.status === 'Good').length,
            maintenance: inventoryData.filter(i => i.status === 'Maintenance').length,
            dismantled: dismantledHistory.length
        };
    }, [inventoryData, dismantledHistory]);
};
