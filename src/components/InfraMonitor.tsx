"use client";

import React, { useState, useEffect } from 'react';

export default function InfraMonitor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/infra-monitor')
        .then(res => res.json())
        .then(json => {
          setData(json);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
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

      <div className="grid grid-cols-1 gap-2.5">
        {/* Power Grid */}
        <div className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/5">
          <div className="flex flex-col">
            <div className="text-[9px] text-gray-500 uppercase font-bold">Power Grid</div>
            <div className="text-[14px] font-mono font-bold text-white uppercase tracking-tighter">
              {data?.generationValue ? `${Math.round(data.generationValue)}` : '395'} 
              <span className="text-[8px] text-gray-500 ml-1">BKWH</span>
            </div>
          </div>
          <div className="text-[12px] font-mono font-bold text-green-400">OPERATIONAL</div>
        </div>

        {/* Undersea Cables */}
        <div className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/5">
          <div className="flex flex-col">
            <div className="text-[9px] text-gray-500 uppercase font-bold">Undersea Cables</div>
            <div className="text-[14px] font-mono font-bold text-white uppercase tracking-tighter">
              {data?.cableAnomalies || 0} <span className="text-[8px] text-gray-500 ml-1">ALERTS</span>
            </div>
          </div>
          <div className={`text-[12px] font-mono font-bold ${data?.cableAnomalies > 0 ? 'text-orange-400' : 'text-green-400'}`}>
            {data?.cableAnomalies > 0 ? 'DEGRADED' : 'OPERATIONAL'}
          </div>
        </div>

        {/* Telcom Towers */}
        <div className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/5">
          <div className="flex flex-col">
            <div className="text-[9px] text-gray-500 uppercase font-bold">Telcom Towers</div>
            <div className="text-[14px] font-mono font-bold text-white uppercase tracking-tighter">
              {data?.telcomOutages || 0} <span className="text-[8px] text-gray-500 ml-1">OUTAGES</span>
            </div>
          </div>
          <div className={`text-[12px] font-mono font-bold ${data?.telcomOutages > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {data?.telcomOutages > 0 ? 'DOWNTIME' : 'LIVE'}
          </div>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-purple-900/20 flex justify-between items-center">
        <span className="text-[9px] text-gray-500 uppercase">System Stability</span>
        <span className="text-[9px] text-green-400 font-mono font-bold">99.98%</span>
      </div>
    </div>
  );
}
