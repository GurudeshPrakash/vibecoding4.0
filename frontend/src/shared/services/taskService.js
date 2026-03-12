/**
 * taskService.js
 * Manages Physical Equipment Removal Tasks and Reports.
 * Uses localStorage for persistence in the current simulation architecture.
 */

const TASKS_KEY = 'dev_equipment_removal_tasks';
const REPORTS_KEY = 'dev_removal_reports';

export const taskService = {
    /**
     * Creates a new physical removal task after admin approval.
     */
    createTask: (data) => {
        const tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
        const adminUser = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
        const adminName = `${adminUser.firstName || ''} ${adminUser.lastName || ''}`.trim() || 'Admin';

        const newTask = {
            task_id: `TASK-${Date.now()}`,
            request_id: data.request_id || data.id,
            machineId: data.machineId,
            equipment_name: data.equipment_name || data.machineName,
            location: data.location || data.branch || 'Main Branch',
            approved_by: adminName,
            approved_date: new Date().toISOString(),
            assigned_staff: data.assigned_staff || 'Staff User',
            removal_status: 'Pending',
            removal_date: null,
            remarks: data.remarks || 'Proceed with physical removal as approved.'
        };

        tasks.unshift(newTask);
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
        return newTask;
    },

    /**
     * Gets all pending tasks for a specific branch or staff.
     */
    getPendingTasks: () => {
        const tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
        return tasks.filter(t => t.removal_status === 'Pending');
    },

    /**
     * Mark a task as completed and generate a report.
     */
    completeTask: async (taskId, staffName) => {
        const tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
        const taskIndex = tasks.findIndex(t => t.task_id === taskId);

        if (taskIndex === -1) return null;

        const updatedTask = {
            ...tasks[taskIndex],
            removal_status: 'Completed',
            removal_date: new Date().toISOString(),
            performed_by: staffName
        };

        tasks[taskIndex] = updatedTask;
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

        // Generate Report Data
        const reports = JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]');
        const newReport = {
            report_id: `REP-${Date.now()}`,
            request_id: updatedTask.request_id,
            equipment_name: updatedTask.equipment_name,
            location: updatedTask.location,
            approved_by: updatedTask.approved_by,
            staff_performed: staffName,
            removal_date: updatedTask.removal_date,
            status: 'Removed & Verified'
        };

        reports.unshift(newReport);
        localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));

        // TRIGER PDF DOWNLOAD
        try {
            const pdfModule = await import('./pdfService');
            const pdfSvc = pdfModule.default || pdfModule.pdfService;
            if (pdfSvc && pdfSvc.generateRemovalReport) {
                pdfSvc.generateRemovalReport(newReport);
            } else {
                console.error('pdfService not found in module', pdfModule);
            }
        } catch (err) {
            console.error('PDF Generation failed:', err);
        }


        return { task: updatedTask, report: newReport };
    },

    /**
     * Get all removal reports.
     */
    getReports: () => {
        return JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]');
    }
};

export default taskService;
