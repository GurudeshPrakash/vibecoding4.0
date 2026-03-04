const fs = require('fs');
const content = fs.readFileSync('src/components/super-admin/SuperAdminDashboard.jsx', 'utf8');

let newContent = content.replace(/<<<<<<< HEAD\n\n    return \([\s\S]*?<<<<<<< HEAD\n                    <\/form>\n=======\n                    <\/div>\n>>>>>>>[^\n]*\n/g, `    const filteredActivities = useMemo(() => {
        if (!searchQuery.trim()) return recentActivities;
        const q = searchQuery.toLowerCase();
        return recentActivities.filter(act =>
            act.user.toLowerCase().includes(q) ||
            act.action.toLowerCase().includes(q)
        );
    }, [recentActivities, searchQuery]);

    if (isLoading && !stats) {
        return (
            <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <Loader2 className="animate-spin" size={48} color="var(--color-red)" />
                <span style={{ fontWeight: 800, color: 'var(--color-text-dim)', letterSpacing: '0.1em' }}>INITIALIZING LIVE COMMAND CENTER...</span>
            </div>
        );
    }

    return (
        <div className="super-admin-dashboard">
            <header className="sa-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="sa-welcome" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                    <h1 style={{ margin: 0, padding: 0 }}>Admin Dashboard</h1>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>Monitor and manage your entire gym system.</p>
                </div>

                <div className="sa-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '100%' }}>
                    <button className="add-admin-btn" style={{ background: '#ff0000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(255,0,0,0.2)' }}>
                        <UserPlus size={20} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '0.85rem', fontWeight: 800, lineHeight: 1.2 }}>
                            <span>Add</span>
                            <span>Admin</span>
                        </div>
                    </button>

                    <button className="add-branch-btn" style={{ background: '#f8f9fa', color: '#000', border: '1px solid #e0e0e0', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <Building2 size={20} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '0.85rem', fontWeight: 800, lineHeight: 1.2 }}>
                            <span>Add</span>
                            <span>Branch</span>
                        </div>
                    </button>

                    <form className="sa-search-bar" onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: '#f8f9fa', borderRadius: '12px', padding: '0 16px', border: '1px solid #e0e0e0', height: '44px', width: '280px' }}>
                        <Search className="sa-search-icon" size={18} color="#888" style={{ marginRight: '12px' }} />
                        <div style={{ height: '22px', width: '1px', background: '#d1d5db', marginRight: '12px' }}></div>
                        <input
                            type="text"
                            placeholder="Search Members, Managers, Branches..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', fontWeight: 500, color: '#333' }}
                        />
                    </form>`);

newContent = newContent.replace(/<<<<<<< HEAD\n                        <div style={{ height: '240px', minHeight: '240px', width: '100%', marginTop: '10px' }}>[\s\S]*?>>>>>>>[^\n]*\n/g, `                        <div style={{ height: '240px', minHeight: '240px', width: '100%', marginTop: '10px' }}>
                            <Recharts.ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <Recharts.AreaChart data={memberGrowthData}>
                                    <defs>
                                        <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF0000" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                    <Recharts.XAxis
                                        dataKey="name"
                                        axisLine={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
                                        tickLine={false}
                                        tick={{ fill: 'var(--color-text-dim)', fontSize: 9, fontWeight: 700 }}
                                        dy={10}
                                        interval={0}
                                    />
                                    <Recharts.YAxis
                                        axisLine={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
                                        tickLine={false}
                                        tick={{ fill: 'var(--color-text-dim)', fontSize: 9, fontWeight: 700 }}
                                        dx={-10}
                                        domain={[0, 'auto']}
                                        allowDecimals={false}
                                        tickFormatter={(value) => {
                                            if (value >= 1000000) return \`LKR \${(value / 1000000).toFixed(1)}M\`;
                                            if (value >= 1000) return \`LKR \${(value / 1000).toFixed(0)}K\`;
                                            return \`LKR \${value}\`;
                                        }}
                                    />
                                    <Recharts.Tooltip
                                        contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#FF0000', fontWeight: 800 }}
                                    />
                                    <Recharts.Area type="monotone" dataKey="members" stroke="#FF0000" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" animationDuration={1800} />
                                </Recharts.AreaChart>
                            </Recharts.ResponsiveContainer>
                        </div>
                    </div>
                    {/* Removed Revenue Stream and Gym Distribution */}`);

newContent = newContent.replace(/<<<<<<< HEAD\n                <div className="sa-activity-feed" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '8px' }}>[\s\S]*?>>>>>>>[^\n]*\n/g, `                <div className="sa-activity-feed" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '8px' }}>
                    {filteredActivities.length > 0 ? (
                        filteredActivities.map(activity => (
                            <div key={activity.id} className="sa-activity-item">
                                <div className="sa-activity-icon">
                                    {activity.icon}
                                </div>
                                <div className="sa-activity-info">
                                    <p><strong>{activity.user}</strong> {activity.action}</p>
                                    <span>{activity.time}</span>
                                </div>
                                <div className="activity-status-chip">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-dim)', fontWeight: 600 }}>
                            No events found matching "{searchQuery}"
                        </div>
                    )}
                </div>`);

fs.writeFileSync('src/components/super-admin/SuperAdminDashboard.jsx', newContent);
console.log('Script completed');
