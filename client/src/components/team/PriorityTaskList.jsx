import Badge from '../common/Badge';
import { formatRelativeDate, isOverdue } from '../../utils/format-date';

const PRIORITY_ORDER = ['urgent', 'high', 'medium', 'low'];

const PRIORITY_COLORS = {
  urgent: 'var(--color-priority-urgent)',
  high: 'var(--color-priority-high)',
  medium: 'var(--color-priority-medium)',
  low: 'var(--color-priority-low)',
};

export default function PriorityTaskList({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
        No tasks assigned
      </div>
    );
  }

  const grouped = PRIORITY_ORDER.reduce((acc, p) => {
    const group = tasks.filter(t => t.priority === p);
    if (group.length > 0) acc[p] = group;
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {Object.entries(grouped).map(([priority, items]) => (
        <div key={priority}>
          {/* Group header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-2)',
            paddingBottom: 'var(--space-2)',
            borderBottom: '1px solid var(--color-border-light)',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_COLORS[priority], flexShrink: 0 }} />
            <span style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-secondary)',
              textTransform: 'capitalize',
            }}>
              {priority} · {items.length}
            </span>
          </div>

          {/* Task rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {items.map(task => {
              const overdue = isOverdue(task.due_date);
              return (
                <div key={task.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--border-radius-md)',
                  background: 'var(--color-bg)',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {task.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 2 }}>
                      {task.project_name && (
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          {task.project_name}
                        </span>
                      )}
                      {task.due_date && (
                        <>
                          <span style={{ color: 'var(--color-border)', fontSize: 10 }}>·</span>
                          <span style={{
                            fontSize: 'var(--font-size-xs)',
                            color: overdue ? 'var(--color-error)' : 'var(--color-text-muted)',
                            fontWeight: overdue ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                          }}>
                            {formatRelativeDate(task.due_date)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <Badge value={task.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
