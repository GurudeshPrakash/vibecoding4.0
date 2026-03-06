import React from 'react';
import { X, Download, Printer } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const EquipmentQrModal = ({
    item,
    onClose,
    logo,
    onDownload,
    onPrint
}) => {
    if (!item) return null;

    const generateQRValue = (item) => {
        return `--- EQUIPMENT PROFILE ---
NAME: ${item.name}
ID: ${item.id}
SERIAL: ${item.serial || 'N/A'}
BRAND: ${item.brand || 'N/A'}
MODEL: ${item.model || 'N/A'}
MFG YEAR: ${item.mfgYear || 'N/A'}
ZONE: ${item.area}
STATUS: ${item.status}

POWER WORLD GYMS
Digital Asset Record`;
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '400px', padding: '24px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#1E293B' }}>Equipment QR Code</h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                </div>

                <div style={{ background: '#F8FAFC', padding: '32px', borderRadius: '12px', marginBottom: '20px', display: 'inline-block' }}>
                    <QRCodeCanvas
                        id={`qr-code-${item.id}`}
                        value={generateQRValue(item)}
                        size={200}
                        level={"H"}
                        includeMargin={true}
                        imageSettings={{
                            src: logo,
                            height: 40,
                            width: 40,
                            excavate: true,
                        }}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', color: '#1E293B' }}>{item.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>Serial: {item.serial}</p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={onDownload} style={{ flex: 1, padding: '12px', background: 'rgba(59, 130, 246, 0.08)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#3B82F6', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Download size={16} /> Download
                    </button>
                    <button onClick={onPrint} style={{ flex: 1, padding: '12px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Printer size={16} /> Print Label
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EquipmentQrModal;
