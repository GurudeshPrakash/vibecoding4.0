import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * pdfService.js
 * Specialized service for generating enterprise-grade PDF reports.
 */
export const pdfService = {
    /**
     * Generates and downloads a Physical Equipment Removal Report.
     */
    generateRemovalReport: (reportData) => {
        try {
            console.log('Generating PDF with jspdf...', reportData);

            // Handle different import styles for jsPDF
            const PDFClass = jsPDF.jsPDF || jsPDF;
            const doc = new PDFClass();

            const timestamp = new Date().toLocaleString();

            // Header Design
            doc.setFillColor(30, 58, 95); // Dark Blue Branding
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('POWER WORLD GYMS', 20, 20);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('EQUIPMENT DISMANTLE & REMOVAL REPORT', 20, 30);
            doc.text(`Generated on: ${timestamp}`, 140, 30);

            // Body Content
            doc.setTextColor(30, 58, 95);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Report Details', 20, 55);

            // Table using autoTable function directly (more robust)
            const tableData = [
                ['Report Reference', reportData.report_id || 'N/A'],
                ['Request Reference', reportData.request_id || 'N/A'],
                ['Asset Name', reportData.equipment_name || 'N/A'],
                ['Location / Branch', reportData.location || 'N/A'],
                ['Administrative Approval', reportData.approved_by || 'Admin'],
                ['Removal Performed By', reportData.staff_performed || 'Staff'],
                ['Completion Date', reportData.removal_date ? new Date(reportData.removal_date).toLocaleString() : 'N/A'],
                ['Final Status', reportData.status || 'N/A'],
            ];

            autoTable(doc, {
                startY: 65,
                theme: 'striped',
                headStyles: { fillColor: [30, 58, 95], fontStyle: 'bold' },
                body: tableData,
                styles: { fontSize: 10, cellPadding: 5 },
                columnStyles: { 0: { fontStyle: 'bold', width: 60 } }
            });

            // Verification Section
            const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 150) + 30;
            doc.setFontSize(11);
            doc.text('Verification & Signatures', 20, finalY);

            doc.setDrawColor(200, 200, 200);
            doc.line(20, finalY + 15, 80, finalY + 15);
            doc.line(130, finalY + 15, 190, finalY + 15);

            doc.setFontSize(8);
            doc.text('Staff Signature / Verification', 20, finalY + 20);
            doc.text('Branch Stamp', 130, finalY + 20);

            // Footer
            doc.setTextColor(150, 150, 150);
            doc.text('This is a system-generated report for audit purposes.', 105, 285, { align: 'center' });

            // Trigger Download
            doc.save(`${reportData.report_id || 'Removal'}_Report.pdf`);
            console.log('PDF saved successfully');
            return true;
        } catch (error) {
            console.error('Critical Error in PDF Generation:', error);
            alert('PDF selection failed. Please check the console for details.');
            return false;
        }
    }
};

export default pdfService;
