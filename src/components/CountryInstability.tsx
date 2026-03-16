"use client";

import React, { useState, useEffect } from 'react';
import IntelligenceBrief from './IntelligenceBrief';

export default function CountryInstability() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = () => {
      fetch('/api/intelligence-brief')
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

  if (loading) return <div className="widget-card animate-pulse h-[600px] bg-white/5"></div>;

  const stats = data?.stats || { unrest: 16, conflict: 0, security: 35, information: 50, index: 50, status: 'stable' };

  return (
    <div className="widget-card flex flex-col h-full bg-black/40 border-l-0 border-r-0 rounded-none max-h-[800px]">
      <div className="widget-header border-b border-white/5 pb-2 sticky top-0 bg-[#0a0a0a] z-10 px-4 pt-3">
        <div className="flex items-center justify-between w-full">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Country Instability Index</span>
           <span className="text-[10px] text-blue-500 font-mono">LIVE INTEL</span>
        </div>
      </div>

      <div className="widget-content flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
        {/* Section 1: Top Index & Main Bars */}
        <div className="flex flex-col gap-6 mb-8 mt-2">
            <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${stats.index > 70 ? 'text-red-500' : 'text-orange-500'} font-mono`}>
                {stats.index}/100
            </div>
            <div className="flex flex-col">
                <div className="text-[10px] uppercase text-gray-500 font-bold">Current Regime</div>
                <div className="flex items-center gap-2 text-xs text-white font-bold">
                    <span>{stats.status.toUpperCase()}</span>
                    <span className="text-gray-600">→</span>
                </div>
            </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {[
                    { label: 'Unrest', value: stats.unrest, icon: '📢', color: 'bg-orange-500' },
                    { label: 'Conflict', value: stats.conflict, icon: '⚔️', color: 'bg-red-500' },
                    { label: 'Security', value: stats.security, icon: '🛡️', color: 'bg-yellow-500' },
                    { label: 'Information', value: stats.information, icon: '📡', color: 'bg-orange-400' },
                ].map((bar) => (
                    <div key={bar.label} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">{bar.label}</span>
                            <span className="text-[10px] font-mono text-gray-300 font-bold">{bar.value}</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${bar.color}`} style={{ width: `${bar.value}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Section 2: Intelligence Brief (MOVED UP) */}
        <div className="mb-8 p-3 bg-white/5 border border-white/5 rounded">
            <IntelligenceBrief customBrief={data?.brief} />
        </div>

        {/* Section 3: Active Signals (Image 6) */}
        <div className="mb-8">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Active Signals</div>
            <div className="flex flex-wrap gap-2">
                {[
                    { label: `${stats.protests || 8} Protests`, icon: '📢', color: 'border-orange-500/50 text-orange-400 bg-orange-500/5' },
                    { label: `${stats.flights || 1} Military Air`, icon: '✈️', color: 'border-blue-500/50 text-blue-400 bg-blue-500/5' },
                    { label: `${stats.ships || 3} Naval Vessels`, icon: '⚓', color: 'border-blue-400/50 text-blue-300 bg-blue-400/5' },
                    { label: '1 Temporal Anomalies', icon: '⏱️', color: 'border-yellow-500/50 text-yellow-400 bg-yellow-500/5' },
                    { label: '4K Displaced', icon: '🌊', color: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/5' },
                    { label: `${stats.strikes || 14} Active Strikes`, icon: '💥', color: 'border-red-500/50 text-red-400 bg-red-500/5' },
                    { label: '2 Advisory: Reconsider Travel', icon: '⚠️', color: 'border-yellow-600/50 text-yellow-500 bg-yellow-600/5' },
                    { label: '60 GPS Jamming Zones', icon: '🛰️', color: 'border-gray-500/50 text-gray-400 bg-gray-500/5' },
                ].map((s) => (
                    <div key={s.label} className={`px-2 py-1 rounded-full border ${s.color} text-[9px] font-bold flex items-center gap-1`}>
                        <span>{s.icon}</span>
                        <span>{s.label.toUpperCase()}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 p-3 bg-white/5 rounded border border-white/5">
                {[
                    { label: 'Critical', count: stats.conflict > 50 ? 1 : 0, color: 'text-red-500' },
                    { label: 'High', count: stats.unrest > 50 ? 1 : 0, color: 'text-orange-500' },
                    { label: 'Moderate', count: stats.index > 40 ? 1 : 0, color: 'text-yellow-500' },
                    { label: 'Low', count: 2, color: 'text-green-500' },
                ].map(sev => (
                    <div key={sev.label} className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-bold">{sev.label}</span>
                        <div className={`w-5 h-5 rounded-full border border-current ${sev.color} flex items-center justify-center text-[10px] font-bold`}>
                            {sev.count}
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-[10px] text-gray-600 italic mt-2">
                {stats.index < 70 ? "No recent high-severity signals." : "Alert: High instability signals detected."}
            </div>
        </div>

        {/* Section 4: 7-Day Timeline (Image 6) */}
        <div className="mb-8">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">7-Day Timeline</div>
            <div className="relative h-32 w-full border-l border-white/10 ml-12">
                {['Protest', 'Conflict', 'Natural', 'Military'].map((type, idx) => (
                    <div key={type} className="flex items-center h-8 relative">
                        <span className={`absolute -left-14 text-[10px] font-bold ${idx === 0 ? 'text-orange-400' : idx === 1 ? 'text-red-400' : idx === 2 ? 'text-purple-400' : 'text-blue-400'}`}>
                            {type}
                        </span>
                        <div className="w-full h-px bg-white/5 absolute"></div>
                        {idx === 1 && stats.conflict > 0 && (
                            <div className="flex gap-1 ml-40">
                                <div className="w-3 h-3 rounded-full bg-red-500 opacity-60"></div>
                                <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5 border border-black"></div>
                            </div>
                        )}
                        {idx === 0 && (
                            <div className="absolute right-0 w-3 h-3 rounded-full bg-orange-500 border-2 border-white/20 shadow-[0_0_8px_orange]"></div>
                        )}
                        {idx === 3 && (
                            <div className="absolute right-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-white/20"></div>
                        )}
                    </div>
                ))}
                <div className="absolute -bottom-4 right-0 text-[10px] text-gray-600 font-mono">now</div>
                <div className="absolute top-0 bottom-0 right-1 border-r border-dashed border-gray-600"></div>
            </div>
        </div>

        {/* Section 5: Military Activity (Image 7) */}
        <div className="mb-8">
             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Military Activity</div>
             <div className="grid grid-cols-2 gap-x-8 gap-y-3 p-3 bg-white/5 rounded border border-white/5">
                {[
                    { label: 'Own Flights', value: 0, color: 'text-gray-400' },
                    { label: 'Foreign Flights', value: stats.flights || 1, color: 'text-red-500' },
                    { label: 'Naval Vessels', value: stats.ships || 3, color: 'text-gray-400' },
                    { label: 'Foreign Presence', value: 'Detected', color: 'text-red-500', isBadge: true },
                ].map(act => (
                    <div key={act.label} className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-bold">{act.label}</span>
                        {act.isBadge ? (
                            <span className="text-[9px] px-2 py-0.5 bg-red-500/20 text-red-500 rounded-full border border-red-500/50 font-bold">DETECTED</span>
                        ) : (
                            <div className={`w-5 h-5 rounded-full border border-white/10 text-white flex items-center justify-center text-[10px] font-bold ${Number(act.value) > 0 ? 'bg-red-500/20 text-red-500 border-red-500/50' : ''}`}>
                                {act.value}
                            </div>
                        )}
                    </div>
                ))}
                <div className="col-span-2 pt-2 border-t border-white/5 mt-1">
                    <div className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-tighter">Nearest Military Bases</div>
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-gray-300">Prince Sultan Air Base</span>
                        <span className="font-mono text-gray-500">247 km</span>
                    </div>
                </div>
             </div>
        </div>

        {/* Section 6: Infrastructure Exposure (Image 7/8) */}
        <div className="mb-8">
             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Infrastructure Exposure</div>
             <div className="grid grid-cols-2 gap-3">
                {[
                    { label: 'Pipelines', count: 2, icon: '🛢️' },
                    { label: 'Data Centers', count: 3, icon: '💻' },
                    { label: 'Military Bases', count: 1, icon: '🛡️' },
                ].map(infra => (
                    <div key={infra.label} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
                        <div className="flex items-center gap-2">
                            <span className="text-xs">{infra.icon}</span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">{infra.label}</span>
                        </div>
                        <span className="text-sm font-bold font-mono">{infra.count}</span>
                    </div>
                ))}
             </div>
        </div>

        {/* Section 7: Economic Indicators (Image 8) */}
        <div className="mb-2">
             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3" id="economic-indicators">Economic Indicators</div>
             <div className="flex flex-col gap-3">
                <div className="p-3 bg-red-900/10 border border-red-900/20 rounded">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-gray-300">Stock Index <span className="text-red-500">↓</span></span>
                    </div>
                    <div className="text-sm font-bold font-mono">Tadawul: 10900.98 SAR</div>
                    <div className="text-[9px] text-gray-500 uppercase font-bold mt-1">Market Service</div>
                </div>

                <div className="p-3 bg-red-900/10 border border-red-900/20 rounded">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-gray-300">Weekly Momentum <span className="text-red-500">↓</span></span>
                    </div>
                    <div className="text-sm font-bold font-mono">-0.96%</div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-gray-300">Instability Regime <span className="text-gray-500">→</span></span>
                    </div>
                    <div className="text-sm font-bold font-mono">{stats.index}/100 ({stats.status})</div>
                    <div className="text-[9px] text-gray-500 uppercase font-bold mt-1">CII</div>
                </div>
             </div>
        </div>
      </div>

      <div className="p-3 border-t border-white/5 bg-black/40 flex justify-between items-center text-[9px] text-gray-600 font-mono">
         <span>DATA SRC: GEO-INTELLIGENCE</span>
         <span className="text-blue-500/70">SYNC: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
