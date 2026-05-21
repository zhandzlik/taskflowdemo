import { useState } from 'react';
import { api } from '../../utils/api-client';
import WorkloadCard from './WorkloadCard';
import PriorityTaskList from './PriorityTaskList';
import Spinner from '../common/Spinner';

export default function WorkloadExpandable({ members, threshold }) {
  const [expandedId, setExpandedId] = useState(null);
  const [taskCache, setTaskCache] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  async function handleCardClick(member) {
    if (expandedId === member.id) {
      setExpandedId(null);
      return;
    }
    if (taskCache[member.id]) {
      setExpandedId(member.id);
      return;
    }
    setLoadingId(member.id);
    try {
      const tasks = await api.get(`/team/${member.id}/tasks`);
      setTaskCache(prev => ({ ...prev, [member.id]: tasks }));
      setExpandedId(member.id);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {members?.map(member => {
        const isOverloaded = member.total_tasks > threshold;
        const isExpanded = expandedId === member.id;
        const isLoading = loadingId === member.id;

        return (
          <div key={member.id} style={{
            display: 'flex',
            borderRadius: 'var(--border-radius-lg)',
            overflow: 'hidden',
            boxShadow: isExpanded ? 'var(--shadow-sm)' : 'none',
            transition: 'box-shadow 200ms ease',
          }}>
            {/* Card column */}
            <div style={{ width: 340, flexShrink: 0 }}>
              <WorkloadCard
                member={member}
                isOverloaded={isOverloaded}
                onClick={handleCardClick}
                isActive={isExpanded}
              />
            </div>

            {/* Expansion column */}
            <div style={{
              flex: 1,
              maxHeight: isExpanded ? 500 : 0,
              opacity: isExpanded ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 280ms ease, opacity 200ms ease',
              background: 'var(--color-surface)',
              borderTop: '1px solid var(--color-border)',
              borderRight: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)',
              borderRadius: '0 var(--border-radius-lg) var(--border-radius-lg) 0',
            }}>
              <div style={{ padding: 'var(--space-5)', height: '100%', overflowY: 'auto' }}>
                {isLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-8)' }}>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <div style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 'var(--space-4)',
                    }}>
                      {member.name}'s Tasks
                    </div>
                    <PriorityTaskList tasks={taskCache[member.id]} />
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
