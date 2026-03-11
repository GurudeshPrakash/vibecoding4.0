import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceDot
} from 'recharts';

// Base data for the X-axis (6:00 AM to 10:00 PM)
const baseData = [
    { time: '6:00 AM', Colombo: 25, Galle: 15, Kandy: 30, Kurunegala: 20, Matara: 18, Negombo: 55 },
    { time: '7:00 AM', Colombo: 40, Galle: 25, Kandy: 45, Kurunegala: 35, Matara: 30, Negombo: 45 },
    { time: '8:00 AM', Colombo: 35, Galle: 30, Kandy: 68, Kurunegala: 40, Matara: 25, Negombo: 35 },
    { time: '9:00 AM', Colombo: 28, Galle: 22, Kandy: 60, Kurunegala: 48, Matara: 22, Negombo: 28 },
    { time: '10:00 AM', Colombo: 22, Galle: 18, Kandy: 40, Kurunegala: 58, Matara: 20, Negombo: 22 },
    { time: '11:00 AM', Colombo: 20, Galle: 15, Kandy: 30, Kurunegala: 52, Matara: 18, Negombo: 20 },
    { time: '12:00 PM', Colombo: 25, Galle: 20, Kandy: 25, Kurunegala: 30, Matara: 25, Negombo: 25 },
    { time: '1:00 PM', Colombo: 22, Galle: 18, Kandy: 20, Kurunegala: 25, Matara: 20, Negombo: 22 },
    { time: '2:00 PM', Colombo: 18, Galle: 15, Kandy: 18, Kurunegala: 18, Matara: 15, Negombo: 18 },
    { time: '3:00 PM', Colombo: 30, Galle: 25, Kandy: 25, Kurunegala: 20, Matara: 35, Negombo: 30 },
    { time: '4:00 PM', Colombo: 50, Galle: 40, Kandy: 35, Kurunegala: 25, Matara: 58, Negombo: 45 },
    { time: '5:00 PM', Colombo: 70, Galle: 55, Kandy: 40, Kurunegala: 30, Matara: 72, Negombo: 55 },
    { time: '6:00 PM', Colombo: 92, Galle: 68, Kandy: 45, Kurunegala: 35, Matara: 65, Negombo: 62 },
    { time: '7:00 PM', Colombo: 85, Galle: 82, Kandy: 40, Kurunegala: 30, Matara: 50, Negombo: 50 },
    { time: '8:00 PM', Colombo: 65, Galle: 75, Kandy: 30, Kurunegala: 25, Matara: 35, Negombo: 40 },
    { time: '9:00 PM', Colombo: 45, Galle: 50, Kandy: 20, Kurunegala: 20, Matara: 25, Negombo: 30 },
    { time: '10:00 PM', Colombo: 25, Galle: 30, Kandy: 15, Kurunegala: 15, Matara: 15, Negombo: 20 },
];

const branches = [
    { key: 'Colombo', color: '#6FA8FF', label: 'Colombo', peak: 92, peakTime: '6:00 PM' },
    { key: 'Galle', color: '#FF7A7A', label: 'Galle', peak: 82, peakTime: '7:00 PM' },
    { key: 'Kandy', color: '#6FD3A3', label: 'Kandy', peak: 68, peakTime: '8:00 AM' },
    { key: 'Kurunegala', color: '#A78BFA', label: 'Kurunegala', peak: 58, peakTime: '10:00 AM' },
    { key: 'Matara', color: '#FF8FB1', label: 'Matara', peak: 72, peakTime: '5:00 PM' },
    { key: 'Negombo', color: '#FFB84D', label: 'Negombo', peak: 62, peakTime: '6:00 PM' },
];

const BranchUsageChart = ({ selectedBranch = 'All', liveData }) => {
    const displayData = liveData || baseData;

    const filteredBranches = selectedBranch === 'All' 
        ? branches 
        : branches.filter(b => b.key === selectedBranch);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={displayData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                        dataKey="time" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8', dy: 10 }}
                        interval={1}
                        padding={{ left: 30, right: 30 }}
                    />
                    <YAxis 
                        domain={[0, 100]}
                        ticks={[0, 25, 50, 75, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
                        width={40}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            padding: '16px',
                            background: '#fff'
                        }}
                        labelStyle={{ fontWeight: 900, color: '#1E293B', marginBottom: '8px', fontSize: '0.9rem' }}
                        itemStyle={{ fontSize: '0.85rem', fontWeight: 700, padding: '4px 0' }}
                    />
                    <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle" 
                        iconType="circle"
                        iconSize={6}
                        wrapperStyle={{ 
                            paddingLeft: '20px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: '#475569',
                            textTransform: 'uppercase'
                        }}
                    />
                    
                    {filteredBranches.map(branch => (
                        <Line 
                            key={branch.key}
                            type="monotone" 
                            dataKey={branch.key} 
                            stroke={branch.color} 
                            strokeWidth={3} 
                            dot={false}
                            activeDot={{ r: 6, fill: branch.color, stroke: '#fff', strokeWidth: 2 }}
                            animationDuration={300} // Faster transition for "live" feel
                            isAnimationActive={true}
                        />
                    ))}

                    {/* Peak Dot for selected branch */}
                    {selectedBranch !== 'All' && filteredBranches.map(branch => (
                        <ReferenceDot 
                            key={`peak-${branch.key}`}
                            x={branch.peakTime} 
                            y={displayData.find(d => d.time === branch.peakTime)?.[branch.key] || 0} 
                            r={5} 
                            fill={branch.color} 
                            stroke="#fff" 
                            strokeWidth={2}
                            isFront={true}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BranchUsageChart;
