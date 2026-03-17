"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share } from 'lucide-react';

const COUNTRIES = [
  { code: 'ir', name: 'Iran', score: 100, level: 'critical', unrest: 98, conflict: 100, security: 40, information: 80 },
  { code: 'ua', name: 'Ukraine', score: 78, level: 'high', unrest: 13, conflict: 5, security: 35, information: 12 },
  { code: 'il', name: 'Israel', score: 73, level: 'high', unrest: 18, conflict: 45, security: 30, information: 54 },
  { code: 'cn', name: 'China', score: 63, level: 'elevated', unrest: 50, conflict: 0, security: 40, information: 90 },
  { code: 'ru', name: 'Russia', score: 55, level: 'elevated', unrest: 45, conflict: 80, security: 60, information: 90 },
  { code: 'sy', name: 'Syria', score: 85, level: 'critical', unrest: 90, conflict: 95, security: 10, information: 40 },
  { code: 'lb', name: 'Lebanon', score: 82, level: 'critical', unrest: 85, conflict: 70, security: 20, information: 50 },
  { code: 'ye', name: 'Yemen', score: 90, level: 'critical', unrest: 95, conflict: 100, security: 10, information: 30 }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'critical': return 'bg-red-500 text-red-500 border-red-500';
    case 'high': return 'bg-orange-500 text-orange-500 border-orange-500';
    case 'elevated': return 'bg-yellow-500 text-yellow-500 border-yellow-500';
    case 'normal': return 'bg-green-500 text-green-500 border-green-500';
    case 'low': return 'bg-white text-white border-white';
    default: return 'bg-gray-500 text-gray-500 border-gray-500';
  }
};

export default function RegionalCountryInstability() {
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  if (selectedCountry) {
    return <DetailedView country={selectedCountry} onBack={() => setSelectedCountry(null)} />;
  }

  return (
    <div className="widget-card flex flex-col h-full bg-black/40 border-l-0 border-r-0 rounded-none max-h-[800px]">
      <div className="widget-header border-b border-white/5 pb-2 sticky top-0 bg-[#0a0a0a] z-10 px-4 pt-3">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Country Instability</span>
             <span className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center text-[9px] text-gray-500 cursor-help">?</span>
           </div>
           <button className="text-gray-500 hover:text-white transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
           </button>
        </div>
      </div>

      <div className="widget-content flex-1 overflow-y-auto px-4 py-4 custom-scrollbar flex flex-col gap-3">
        {COUNTRIES.map((c) => {
           const colorClass = getLevelColor(c.level);
           const barColor = colorClass.split(' ')[0]; // extract bg-color
           
           return (
             <div 
               key={c.code} 
               className="bg-white/5 border border-white/5 rounded-md p-4 cursor-pointer hover:bg-white/10 transition-colors group"
               onClick={() => setSelectedCountry(c)}
             >
               <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center gap-2">
                   <div className={`w-3 h-3 rounded-full ${barColor} shadow-[0_0_8px_currentColor] shadow-${barColor.replace('bg-', '')}`}></div>
                   <span className="text-sm font-bold text-white">{c.name}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="text-sm font-bold text-white font-mono">{c.score} <span className="text-gray-500 text-xs">→</span></span>
                   <button className="p-1 hover:bg-white/10 rounded border border-white/10" onClick={(e) => { e.stopPropagation(); }}>
                      <Share size={12} className="text-gray-400" />
                   </button>
                 </div>
               </div>
               
               <div className="w-full h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
                 <div className={`h-full ${barColor}`} style={{ width: `${c.score}%` }}></div>
               </div>

               <div className="flex items-center gap-4 text-[10px] text-gray-500 font-mono font-bold">
                 <span>U:{c.unrest}</span>
                 <span>C:{c.conflict}</span>
                 <span>S:{c.security}</span>
                 <span>I:{c.information}</span>
               </div>
             </div>
           );
        })}
      </div>

      <div className="p-3 border-t border-white/5 bg-black/40 flex justify-between items-center text-[9px] text-gray-600 font-mono">
         <span>DATA SRC: GEO-INTELLIGENCE</span>
         <span className="text-blue-500/70">SYNC: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

function DetailedView({ country, onBack }: { country: any, onBack: () => void }) {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate fetching country specific data
    const timer = setTimeout(() => {
      setData({
        stats: {
           unrest: country.unrest,
           conflict: country.conflict,
           security: country.security,
           information: country.information,
           index: country.score,
           status: country.level,
           protests: Math.floor(country.unrest / 10),
           flights: Math.floor(country.conflict / 20),
           ships: Math.floor(country.security / 15),
           strikes: Math.floor(country.conflict / 10)
        }
      });
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [country]);

  if (loading) return <div className="widget-card animate-pulse h-[800px] bg-white/5 border-l-0 border-r-0 rounded-none max-h-[800px]"></div>;

  const stats = data.stats;

  return (
    <div className="widget-card flex flex-col h-full bg-black/40 border-l-0 border-r-0 rounded-none max-h-[800px]">
      <div className="widget-header border-b border-white/5 pb-2 sticky top-0 bg-[#0a0a0a] z-10 px-4 pt-3">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-2">
               <button onClick={onBack} className="p-1 hover:bg-white/10 rounded text-gray-400">
                   <ArrowLeft size={12} />
               </button>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{country.name} Instability Index</span>
           </div>
           <span className="text-[10px] text-blue-500 font-mono">LIVE INTEL</span>
        </div>
      </div>

      <div className="widget-content flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
        {/* Section 1: Top Index & Main Bars */}
        <div className="flex flex-col gap-6 mb-8 mt-2">
            <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${stats.index > 70 ? 'text-red-500' : stats.index > 40 ? 'text-orange-500' : 'text-green-500'} font-mono`}>
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

        {/* Section 2: Active Signals */}
        <div className="mb-8">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Active Signals</div>
            <div className="flex flex-wrap gap-2">
                {[
                    { label: `${stats.protests || 0} Protests`, icon: '📢', color: 'border-orange-500/50 text-orange-400 bg-orange-500/5' },
                    { label: `${stats.flights || 0} Military Air`, icon: '✈️', color: 'border-blue-500/50 text-blue-400 bg-blue-500/5' },
                    { label: `${stats.ships || 0} Naval Vessels`, icon: '⚓', color: 'border-blue-400/50 text-blue-300 bg-blue-400/5' },
                    { label: '1 Temporal Anomalies', icon: '⏱️', color: 'border-yellow-500/50 text-yellow-400 bg-yellow-500/5' },
                    { label: '4K Displaced', icon: '🌊', color: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/5' },
                    { label: `${stats.strikes || 0} Active Strikes`, icon: '💥', color: 'border-red-500/50 text-red-400 bg-red-500/5' },
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

        {/* Section 4: 7-Day Timeline */}
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
                        {idx === 0 && stats.unrest > 0 && (
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

        {/* Section 5: Military Activity */}
        <div className="mb-8">
             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Military Activity</div>
             <div className="grid grid-cols-2 gap-x-8 gap-y-3 p-3 bg-white/5 rounded border border-white/5">
                {[
                    { label: 'Own Flights', value: 0, color: 'text-gray-400' },
                    { label: 'Foreign Flights', value: stats.flights || 0, color: 'text-red-500' },
                    { label: 'Naval Vessels', value: stats.ships || 0, color: 'text-gray-400' },
                    { label: 'Foreign Presence', value: stats.conflict > 50 ? 'Detected' : 'Clear', color: stats.conflict > 50 ? 'text-red-500' : 'text-green-500', isBadge: true },
                ].map(act => (
                    <div key={act.label} className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-bold">{act.label}</span>
                        {act.isBadge ? (
                            <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${act.value === 'Detected' ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-green-500/20 text-green-500 border-green-500/50'}`}>
                                {act.value.toUpperCase()}
                            </span>
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
                        <span className="font-bold text-gray-300">Regional Air Base</span>
                        <span className="font-mono text-gray-500">247 km</span>
                    </div>
                </div>
             </div>
        </div>

        {/* Section 6: Infrastructure Exposure */}
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

        {/* Section 7: Economic Indicators */}
        <div className="mb-2">
             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3" id="economic-indicators">Economic Indicators</div>
             <div className="flex flex-col gap-3">
                <div className="p-3 bg-red-900/10 border border-red-900/20 rounded">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-gray-300">Stock Index <span className="text-red-500">↓</span></span>
                    </div>
                    <div className="text-sm font-bold font-mono">Index: 10900.98</div>
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
