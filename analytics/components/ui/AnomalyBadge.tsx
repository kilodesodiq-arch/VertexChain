'use client';

import type { Anomaly } from '@/lib/anomaly';

interface AnomalyBadgeProps {
  anomalies: Anomaly[];
  chartId: string;
}

/** Small badge shown on a chart card when anomalies are detected */
export default function AnomalyBadge({ anomalies, chartId }: AnomalyBadgeProps) {
  const relevant = anomalies.filter((a) => a.chartId === chartId);
  if (relevant.length === 0) return null;

  const hasCritical = relevant.some((a) => a.severity === 'critical');
  const color = hasCritical ? '#ef4444' : '#f59e0b';
  const bg = hasCritical ? '#fef2f2' : '#fffbeb';

  return (
    <span
      title={`${relevant.length} anomal${relevant.length === 1 ? 'y' : 'ies'} detected`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        borderRadius: 999,
        background: bg,
        color,
        border: `1px solid ${color}33`,
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
        }}
      />
      {relevant.length} anomal{relevant.length === 1 ? 'y' : 'ies'}
    </span>
  );
}
