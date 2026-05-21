import { useState } from 'react';
import { api } from '../../utils/api-client';
import WorkloadCard from './WorkloadCard';
import PriorityTaskList from './PriorityTaskList';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';

const PRIORITY_COLORS = {
  urgent: 'var(--color-priority-urgent)',
  high: 'var(--color-priority-high)',
  medium: 'var(--color-priority-medium)',
  low: 'var(--color-priority-low)',
};

export default function WorkloadModal({ members, threshold }) {
  const [modalMember, setModalMember] = useState(null);
  const [modalTasks, setModalTasks] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [taskCache, setTaskCache] = useState({});

  async function handleCardClick(member) {
    if (taskCache[member.id]) {
      setModalMember(member);
      setModalTasks(taskCache[member.id]);
      return;
    }
    setModalMember(member);
    setModalTasks(null);
    setLoadingModal(true);
    try {
      const tasks = await api.get(`/team/${member.id}/tasks`);
      setTaskCache(prev => ({ ...prev, [member.id]: tasks }));
      setModalTasks(tasks);
    } finally {
      setLoadingModal(false);
    }
  }

  function handleClose() {
    setModalMember(null);
    setModalTasks(null);
  }

  const isOverloaded = modalMember && modalMember.total_tasks > threshold;

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
            isActive={modalMember?.id === member.id}
          />
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!modalMember}
        onClose={handleClose}
        title={modalMember ? `${modalMember.name}'s Tasks` : ''}
      >
        {modalMember && (
          <div>
            {/* Priority summary + overload */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-4)',
              paddingBottom: 'var(--space-4)',
              borderBottom: '1px solid var(--color-border-light)',
            }}>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                {[
                  { key: 'urgent', count: modalMember.urgent_count },
                  { key: 'high', count: modalMember.high_count },
                  { key: 'medium', count: modalMember.medium_count },
                  { key: 'low', count: modalMember.low_count },
                ].map(({ key, count }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: count === 0 ? 0.4 : 1 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_COLORS[key] }} />
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text)' }}>{count}</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{key}</span>
                  </div>
                ))}
              </div>
              {isOverloaded && (
                <span style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-error)',
                  background: 'var(--color-error-light)',
                  border: '1px solid var(--color-error)',
                  borderRadius: 'var(--border-radius-full)',
                  padding: '2px 10px',
                  flexShrink: 0,
                }}>
                  Overloaded
                </span>
              )}
            </div>

            {/* Task list or spinner */}
            {loadingModal ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
                <Spinner />
              </div>
            ) : (
              <PriorityTaskList tasks={modalTasks} />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
