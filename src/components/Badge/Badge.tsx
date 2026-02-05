interface BadgeProps {
  type: 'status' | 'priority' | 'due';
  value: string;
  className?: string;
  style?: React.CSSProperties;
}

const Badge = ({ type, value, className = '', style }: BadgeProps) => {
  // Normalize value for CSS classes (e.g., 'in-progress' -> 'in-progress')
  const normalizedValue = value.toLowerCase().replace(/\s+/g, '-');

  let baseClass = '';
  if (type === 'status') baseClass = `status-badge badge-${normalizedValue}`;
  else if (type === 'priority') baseClass = `priority-badge priority-${normalizedValue}`;
  else if (type === 'due') baseClass = `due-badge ${normalizedValue}`;

  return (
    <span className={`${baseClass} ${className}`} style={style}>
      {value}
    </span>
  );
};

export default Badge;
