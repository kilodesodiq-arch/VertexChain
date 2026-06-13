'use client';

import { useState } from 'react';
import type { Anomaly } from '@/lib/anomaly';

interface AnomalySidebarProps {
  anomalies: Anomaly[];
}

/** Sidebar panel listing all detected anomalies */
export default function AnomalySidebar({ anomalies }: AnomalySidebarProps) {
  const [open, setOpen] = useState(false);

  if (anomalies.length === 0) return null;

  const criticalCount = anomalies.filter((a) => a.severity === 'critical').length;

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderRadius: 999,
          border: 'none',
          background: criticalCount > 0 ? '#ef4444' : '#f59e0b',
          color: '#ffffff',
          padding: '12px 18px',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        }}
        aria-label="View anomalies"
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        {anomalies.length} anomal{anomalies.length === 1 ? 'y' : 'ies'}
      </button>

      {/* Drawer */}
      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 55 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 60,
              width: 'min(380px, 100vw)',
              background: '#ffffff',
              borderLeft: '1px solid #e2e8f0',
              boxShadow: '-8px 0 32px rgba(15,23,42,0.12)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>Anomaly Alerts</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  {criticalCount} critical · {anomalies.length - criticalCount} warning
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                aria-label="Close"
              >
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'grid', gap: 10 }}>
              {anomalies.map((anomaly, i) => {
                const isCritical = anomaly.severity === 'critical';
                const color = isCritical ? '#ef4444' : '#f59e0b';
                const bg = isCritical ? '#fef2f2' : '#fffbeb';
                const isSpike = anomaly.direction === 'spike';

                return (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${anomaly.chartId}-${i}`}
                    style={{
                      borderRadius: 14,
                      border: `1px solid ${color}33`,
                      background: bg,
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span
                        style={{
                          borderRadius: 999,
                          background: color,
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '2px 8px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {anomaly.severity}
                      </span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{anomaly.chartId}</span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                      {isSpike ? '↑ Spike' : '↓ Drop'} at {anomaly.label}
                    </div>

                    <div style={{ fontSize: 13, color: '#475569' }}>
                      Value: <strong>{anomaly.current.toLocaleString()}</strong> · Avg:{' '}
                      <strong>{anomaly.average.toLocaleString()}</strong>
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        color,
                      }}
                    >
                      {isSpike ? '+' : ''}{anomaly.pctChange}% from average
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
