import { useState } from 'react';

const PRIORITY_COLORS = {
  urgent: 'var(--color-priority-urgent)',
  high: 'var(--color-priority-high)',
  medium: 'var(--color-priority-medium)',
  low: 'var(--color-priority-low)',
};

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function WorkloadCard({ member, isOverloaded, onClick, isActive }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    background: isOverloaded ? 'var(--color-error-light)' : 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderLeft: isOverloaded ? '4px solid var(--color-error)' : '4px solid transparent',
    borderRadius: 'var(--border-radius-lg)',
    padding: 'var(--space-5)',
    cursor: 'pointer',
    transition: 'box-shadow 150ms ease, transform 150ms ease',
    boxShadow: isActive
      ? 'inset 0 0 0 2px var(--color-primary)'
      : hovered
      ? 'var(--shadow-sm)'
      : 'none',
    transform: hovered && !isActive ? 'translateY(-1px)' : 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
  };

  const avatarStyle = {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: member.avatar_color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'var(--font-weight-bold)',
    fontSize: 'var(--font-size-sm)',
    flexShrink: 0,
  };

  const priorities = [
    { key: 'urgent', count: member.urgent_count },
    { key: 'high', count: member.high_count },
    { key: 'medium', count: member.medium_count },
    { key: 'low', count: member.low_count },
  ];

  return (
    <div
      style={cardStyle}
      onClick={() => onClick(member)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar + identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div style={avatarStyle}>{getInitials(member.name)}</div>
        <div>
          <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>
            {member.name}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
            {member.role}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 1 }}>
            {member.email}
          </div>
        </div>
      </div>

      {/* Priority count chips */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        {priorities.map(({ key, count }) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              opacity: count === 0 ? 0.4 : 1,
            }}
          >
            <div style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: PRIORITY_COLORS[key],
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text)' }}>
              {count}
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              {key}
            </span>
          </div>
        ))}
      </div>

      {/* Footer: total + overload pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
          {member.total_tasks} task{member.total_tasks !== 1 ? 's' : ''} total
        </span>
        {isOverloaded && (
          <span style={{
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-error)',
            background: 'var(--color-error-light)',
            border: '1px solid var(--color-error)',
            borderRadius: 'var(--border-radius-full)',
            padding: '2px 8px',
          }}>
            Overloaded
          </span>
        )}
      </div>
    </div>
  );
}
