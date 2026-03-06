import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logo1.png';

/**
 * Service for generating PDF reports for the Power World Gym Management System.
 * Adheres to high cohesion by centralizing all PDF styling and structure logic.
 */
export const generateDismantleReport = (item) => {
    const doc = new jsPDF();

    // 1. Setup Branding & Theme
    const setupHeader = (pdfDoc) => {
        pdfDoc.setFillColor(20, 20, 20); // Dark theme matching app
        pdfDoc.rect(0, 0, 210, 40, 'F');
    };

    const addHeadings = (pdfDoc, equipmentId) => {
        pdfDoc.setTextColor(255, 255, 255);
        pdfDoc.setFontSize(22);
        pdfDoc.setFont('helvetica', 'bold');
        pdfDoc.text('DISMANTLE CERTIFICATE', 55, 20);
        pdfDoc.setFontSize(10);
        pdfDoc.text('Power World Gym Management System - Disposal Report', 55, 28);

        pdfDoc.setTextColor(50, 50, 50);
        pdfDoc.setFontSize(10);
        pdfDoc.setFont('helvetica', 'normal');
        pdfDoc.text(`Report Generated: ${new Date().toLocaleString()}`, 140, 50);
        pdfDoc.text(`Equipment ID: ${equipmentId}`, 15, 50);
    };

    const addSignatures = (pdfDoc, finalY) => {
        const signatureY = finalY + 30;
        pdfDoc.line(15, signatureY, 70, signatureY);
        pdfDoc.text('Manager Signature', 15, signatureY + 5);

        pdfDoc.line(130, signatureY, 190, signatureY);
        pdfDoc.text('Admin Approval Signature', 130, signatureY + 5);

        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(150, 150, 150);
        pdfDoc.text('This is a computer-generated report. Power World Management.', 70, 285);
    };

    const img = new Image();
    img.src = logo;

    const runGeneration = () => {
        setupHeader(doc);

        // Handle Logo (Safe check)
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const logoBase64 = canvas.toDataURL('image/png');
                doc.addImage(logoBase64, 'PNG', 15, 10, 30, 20);
            }
        } catch (e) {
            console.warn('Logo processing failed, falling back to text branding');
            doc.setTextColor(255, 255, 255);
            doc.text('POWER WORLD', 15, 25);
        }

        addHeadings(doc, item.equipmentCustomId || item.id);

        // 2. Data Table
        autoTable(doc, {
            startY: 60,
            head: [['Technical & Historical Snapshot', '']],
            body: [
                ['Equipment Name', item.equipmentName],
                ['Equipment Type', item.equipmentType || 'N/A'],
                ['Branch Office', item.branch],
                ['Purchase Date', item.boughtDate ? new Date(item.boughtDate).toLocaleDateString() : 'N/A'],
                ['Unit Price (LKR)', item.price ? item.price.toLocaleString() : 'N/A'],
                ['Lifetime Maintenance', `${item.maintenanceCount || 0} Sessions`],
                ['Last Service Event', item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString() : 'N/A'],
                ['Initiated By', item.staffName],
                ['Disposal Reason', item.reason || 'Not Specified']
            ],
            theme: 'striped',
            headStyles: { fillColor: [230, 57, 70], textColor: [255, 255, 255], fontStyle: 'bold' },
            styles: { cellPadding: 5, fontSize: 10 },
            columnStyles: { 0: { fontStyle: 'bold', width: 60 } }
        });

        // 3. Footer & Save
        addSignatures(doc, doc.lastAutoTable.finalY);
        doc.save(`Dismantle_Report_${item.equipmentCustomId || 'Item'}.pdf`);
    };

    // Trigger async load then generate
    img.onload = runGeneration;
    img.onerror = runGeneration; // Still generate even if logo fails
    if (img.complete) img.onload();
};
