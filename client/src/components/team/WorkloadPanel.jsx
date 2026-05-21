import { useState } from 'react';
import { api } from '../../utils/api-client';
import WorkloadCard from './WorkloadCard';
import PriorityTaskList from './PriorityTaskList';
import Spinner from '../common/Spinner';

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const PRIORITY_COLORS = {
  urgent: 'var(--color-priority-urgent)',
  high: 'var(--color-priority-high)',
  medium: 'var(--color-priority-medium)',
  low: 'var(--color-priority-low)',
};

export default function WorkloadPanel({ members, threshold }) {
  const [panelMember, setPanelMember] = useState(null);
  const [taskCache, setTaskCache] = useState({});
  const [loadingPanel, setLoadingPanel] = useState(false);

  async function handleCardClick(member) {
    if (panelMember?.id === member.id) {
      setPanelMember(null);
      return;
    }
    if (taskCache[member.id]) {
      setPanelMember(member);
      return;
    }
    setPanelMember(member);
    setLoadingPanel(true);
    try {
      const tasks = await api.get(`/team/${member.id}/tasks`);
      setTaskCache(prev => ({ ...prev, [member.id]: tasks }));
    } finally {
      setLoadingPanel(false);
    }
  }

  const panelTasks = panelMember ? taskCache[panelMember.id] : null;

  return (
    <div>
      {/* Card grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-4)',
      }}>
        {members?.map(member => (
          <WorkloadCard
            key={member.id}
            member={member}
            isOverloaded={member.total_tasks > threshold}
            onClick={handleCardClick}
            isActive={panelMember?.id === member.id}
          />
        ))}
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setPanelMember(null)}
        style={{
          position: 'fixed',
          top: 0,
          right: '380px',
          bottom: 0,
          left: 'var(--sidebar-width)',
          background: 'rgba(0, 0, 0, 0.15)',
          zIndex: 49,
          opacity: panelMember ? 1 : 0,
          pointerEvents: panelMember ? 'auto' : 'none',
          transition: 'opacity 200ms ease',
        }}
      />

      {/* Slide-out panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 380,
        background: 'var(--color-surface)',
        borderLeft: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 50,
        transform: panelMember ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 250ms ease',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {panelMember && (
          <>
            {/* Panel header */}
            <div style={{
              padding: 'var(--space-5) var(--space-6)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: panelMember.avatar_color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'var(--font-weight-bold)',
                  fontSize: 'var(--font-size-xs)',
                  flexShrink: 0,
                }}>
                  {getInitials(panelMember.name)}
                </div>
                <div>
                  <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>
                    {panelMember.name}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                    {panelMember.role}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPanelMember(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 18,
                  color: 'var(--color-text-muted)',
                  padding: 4,
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* Overload + priority summary */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border-light)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  {panelMember.total_tasks} tasks total
                </span>
                {panelMember.total_tasks > threshold && (
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
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                {[
                  { key: 'urgent', count: panelMember.urgent_count },
                  { key: 'high', count: panelMember.high_count },
                  { key: 'medium', count: panelMember.medium_count },
                  { key: 'low', count: panelMember.low_count },
                ].map(({ key, count }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: count === 0 ? 0.4 : 1 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_COLORS[key] }} />
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text)' }}>{count}</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{key}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Task list */}
            <div style={{ padding: 'var(--space-5) var(--space-6)', flex: 1 }}>
              {loadingPanel ? (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-8)' }}>
                  <Spinner />
                </div>
              ) : (
                <PriorityTaskList tasks={panelTasks} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
