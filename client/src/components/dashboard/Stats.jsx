const statCardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-6)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
};

const labelStyle = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
  fontWeight: 'var(--font-weight-medium)',
};

const valueStyle = {
  fontSize: 'var(--font-size-2xl)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
};

const iconBadgeStyle = (bg, color) => ({
  width: 36,
  height: 36,
  borderRadius: 'var(--border-radius-md)',
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color,
});

export default function Stats({ tasks, projects }) {
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.status === 'done').length || 0;
  const inProgress = tasks?.filter((t) => t.status === 'in-progress').length || 0;
  const activeProjects = projects?.filter((p) => p.status === 'active').length || 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      color: 'var(--color-info)',
      bg: 'var(--color-info-light)',
      icon: <><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><path d="M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></>,
    },
    // BUG: Typo — "Completd" instead of "Completed"
    {
      label: 'Completd Tasks',
      value: completedTasks,
      color: 'var(--color-success)',
      bg: 'var(--color-success-light)',
      icon: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>,
    },
    {
      label: 'In Progress',
      value: inProgress,
      color: 'var(--color-warning)',
      bg: 'var(--color-warning-light)',
      icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    },
    {
      label: 'Active Projects',
      value: activeProjects,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-light)',
      icon: <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>,
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
      {stats.map((stat) => (
        <div key={stat.label} style={statCardStyle}>
          <div style={iconBadgeStyle(stat.bg, stat.color)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {stat.icon}
            </svg>
          </div>
          <span style={labelStyle}>{stat.label}</span>
          <span style={valueStyle}>{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
