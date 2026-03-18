"use client";

import React, { useState, useEffect } from 'react';

export default function InfraMonitor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/infra-monitor')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="widget-card p-3 animate-pulse bg-white/5 h-[100px] border-gray-800" />;

  return (
    <div className="widget-card p-3 bg-purple-950/10 border-purple-900/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 blur-2xl rounded-full" />
      
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold uppercase text-purple-400">Infra Monitor</span>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          <span className="text-[9px] text-green-500 font-bold">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-0.5">
          <div className="text-[9px] text-gray-500 uppercase font-bold">Generation</div>
          <div className="text-[14px] font-mono font-bold text-white uppercase tracking-tighter">
            {data?.generationValue ? `${Math.round(data.generationValue)}` : '395'} 
            <span className="text-[8px] text-gray-500 ml-1">BKWH</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[9px] text-gray-500 uppercase font-bold">Status</div>
          <div className="text-[14px] font-mono font-bold text-purple-300">
            {data?.status || 'OPERATIONAL'}
          </div>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-purple-900/20 flex justify-between items-center">
        <span className="text-[9px] text-gray-500 uppercase">Power Grid Stability</span>
        <span className="text-[9px] text-green-400 font-mono font-bold">99.9%</span>
      </div>
    </div>
  );
}
