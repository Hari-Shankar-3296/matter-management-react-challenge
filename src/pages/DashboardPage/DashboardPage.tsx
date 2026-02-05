import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useTicketStats, useMyTickets } from '@/hooks/useTickets/useTickets';
import { TERMINOLOGY } from '@/constants';
import StatCard from '@/components/StatCard/StatCard';
import DashboardChart from '@/components/DashboardChart/DashboardChart';
import TicketListMini from '@/components/TicketListMini/TicketListMini';

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
        <p className="page-subtitle">
          Here's an overview of your {TERMINOLOGY.items.toLowerCase()}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard label="Assigned to Me" value={myTickets?.assigned.length || 0} />
        <StatCard label="Reported by Me" value={myTickets?.reported.length || 0} />
        <StatCard label={`Total ${TERMINOLOGY.ITEMS}`} value={stats?.total || 0} />
        <StatCard label={`Open ${TERMINOLOGY.ITEMS}`} value={stats?.open || 0} />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <DashboardChart title={`${TERMINOLOGY.ITEMS} by Status`} data={statusData} type="pie" />
        <DashboardChart title={`${TERMINOLOGY.ITEMS} by Priority`} data={priorityData} type="bar" />
      </div>

      {/* Recent Tickets */}
      <TicketListMini
        tickets={myTickets?.assigned}
        title={`My Assigned ${TERMINOLOGY.ITEMS}`}
        viewAllLink={TERMINOLOGY.ROUTES.MY_TICKETS}
      />
    </div>
  );
};

export default DashboardPage;
