import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import Spinner from '../components/common/Spinner';
import WorkloadExpandable from '../components/team/WorkloadExpandable';
import WorkloadPanel from '../components/team/WorkloadPanel';
import WorkloadModal from '../components/team/WorkloadModal';

const TABS = [
  { id: 'expandable', label: 'Expand Inline' },
  { id: 'panel', label: 'Side Panel' },
  { id: 'modal', label: 'Detail Modal' },
];

export default function Team() {
  const { data: workloadData, loading: workloadLoading, error: workloadError } = useApi('/team/workload');
  const { data: settings, loading: settingsLoading } = useApi('/settings');
  const [activeTab, setActiveTab] = useState('expandable');

  const threshold = parseInt(settings?.workload_threshold, 10) || 10;
  const loading = workloadLoading || settingsLoading;

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Team Workload</h1>
          <p>
            {workloadData?.length || 0} members · overload threshold: {threshold} tasks
          </p>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-1)',
        marginBottom: 'var(--space-6)',
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-md)',
        padding: 'var(--space-1)',
        width: 'fit-content',
      }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? 'var(--color-surface)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                border: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
                borderRadius: 'var(--border-radius-sm)',
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Error state */}
      {workloadError && (
        <div style={{
          color: 'var(--color-error)',
          background: 'var(--color-error-light)',
          border: '1px solid var(--color-error)',
          borderRadius: 'var(--border-radius-md)',
          padding: 'var(--space-4)',
          fontSize: 'var(--font-size-sm)',
        }}>
          Failed to load workload data. Please try refreshing the page.
        </div>
      )}

      {/* Active variant — mount/unmount on tab switch so state resets cleanly */}
      {!workloadError && workloadData && (
        <>
          {activeTab === 'expandable' && (
            <WorkloadExpandable members={workloadData} threshold={threshold} />
          )}
          {activeTab === 'panel' && (
            <WorkloadPanel members={workloadData} threshold={threshold} />
          )}
          {activeTab === 'modal' && (
            <WorkloadModal members={workloadData} threshold={threshold} />
          )}
        </>
      )}
    </div>
  );
}
