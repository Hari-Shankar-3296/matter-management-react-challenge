import { useAuth } from '../contexts/AuthContext';
import { useTicketStats, useMyTickets } from '../hooks/useTickets';
import { Link } from 'react-router-dom';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const DashboardPage = () => {
    const { user } = useAuth();
    const { data: stats, isLoading: statsLoading } = useTicketStats();
    const { data: myTickets, isLoading: myTicketsLoading } = useMyTickets();

    if (statsLoading || myTicketsLoading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    const statusData = [
        { name: 'Open', value: stats?.open || 0, color: '#10b981' },
        { name: 'In Progress', value: stats?.inProgress || 0, color: '#f59e0b' },
        { name: 'Closed', value: stats?.closed || 0, color: '#6b7280' },
    ];

    const priorityData = [
        { name: 'Critical', value: stats?.byPriority.critical || 0, color: '#ef4444' },
        { name: 'High', value: stats?.byPriority.high || 0, color: '#f97316' },
        { name: 'Medium', value: stats?.byPriority.medium || 0, color: '#eab308' },
        { name: 'Low', value: stats?.byPriority.low || 0, color: '#22c55e' },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Welcome back, {user?.firstName}!</h1>
                <p className="page-subtitle">Here's an overview of your tickets</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{myTickets?.assigned.length || 0}</div>
                    <div className="stat-label">Assigned to Me</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{myTickets?.reported.length || 0}</div>
                    <div className="stat-label">Reported by Me</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats?.total || 0}</div>
                    <div className="stat-label">Total Tickets</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats?.open || 0}</div>
                    <div className="stat-label">Open Tickets</div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Tickets by Status</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Tickets by Priority</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={priorityData}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value">
                                {priorityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Tickets */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h3>My Assigned Tickets</h3>
                    <Link to="/my-tickets" className="link">
                        View All →
                    </Link>
                </div>
                <div className="ticket-list-mini">
                    {myTickets?.assigned.slice(0, 5).map((ticket) => (
                        <div key={ticket.id} className="ticket-item-mini">
                            <div className="ticket-info">
                                <span className="ticket-id">#{ticket.id}</span>
                                <span className="ticket-title">{ticket.title}</span>
                            </div>
                            <span className={`priority-badge priority-${ticket.priority}`}>
                                {ticket.priority}
                            </span>
                        </div>
                    ))}
                    {(!myTickets?.assigned || myTickets.assigned.length === 0) && (
                        <div className="empty-mini">No tickets assigned to you</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
