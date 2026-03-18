"use client";

import React, { useState, useEffect } from 'react';

export default function CyberThreats() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cyber-threats')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="widget-card p-3 animate-pulse bg-white/5 h-[120px] border-gray-800" />;

  const getThreatColor = (level: string) => {
    if (level === 'HIGH') return 'text-red-500';
    if (level === 'MODERATE') return 'text-orange-400';
    return 'text-green-400';
  };

  return (
    <div className="widget-card p-3 bg-red-950/10 border-red-900/20">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-red-400">Cybersecurity threats</span>
        </div>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-800 ${getThreatColor(data?.threatLevel)}`}>
          {data?.threatLevel || 'LOW'} RISK
        </span>
      </div>

      <div className="space-y-1.5">
        {data?.pulses?.length > 0 ? (
          data.pulses.map((pulse: any, i: number) => (
            <div key={i} className="flex justify-between items-start gap-2 border-l border-red-900/30 pl-2">
              <div className="flex-1">
                <div className="text-[10px] text-gray-300 font-medium line-clamp-1">{pulse.name}</div>
                <div className="text-[8px] text-gray-500 font-mono uppercase">{pulse.author} </div>
              </div>
              <span className="text-[9px] text-gray-400 font-mono whitespace-nowrap">{pulse.indicators} IoCs</span>
            </div>
          ))
        ) : (
          <div className="text-[10px] text-gray-500 italic py-2">No critical KSA cyber pulses detected in the last 24h.</div>
        )}
      </div>
    </div>
  );
}
