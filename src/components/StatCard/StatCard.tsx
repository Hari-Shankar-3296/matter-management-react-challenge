interface StatCardProps {
  label: string;
  value: number | string;
  icon?: string;
}

const StatCard = ({ label, value, icon }: StatCardProps) => {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">
        {icon && <span className="stat-icon">{icon}</span>}
        {label}
      </div>
    </div>
  );
};

export default StatCard;
