"use client";

import React from 'react';

interface PostureItem {
  id: string;
  name: string;
  shortName: string;
  status: 'normal' | 'elevated' | 'critical';
  air: number;
  naval: number;
}

export default function StrategicPosture() {
  const [theaters, setTheaters] = React.useState<PostureItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [timestamp, setTimestamp] = React.useState<string>('');

  React.useEffect(() => {
    const fetchData = () => {
      fetch('/api/strategic-posture')
        .then(res => res.json())
        .then(json => {
          setTheaters(json.postures || []);
          setTimestamp(json.timestamp || new Date().toLocaleTimeString());
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="widget-card animate-pulse h-[300px] bg-white/5"></div>;

  return (
    <div className="widget-card h-full flex flex-col">
      <div className="widget-header">
        <div className="flex items-center gap-2">
          <span className="widget-title">AI STRATEGIC POSTURE</span>
          <span className="text-gray-500 cursor-help">ⓘ</span>
        </div>
        <span className="badge badge-new">{theaters.length} AREAS</span>
      </div>
      <div className="widget-content flex flex-col gap-3 overflow-y-auto flex-1 custom-scrollbar">
        {theaters.map((theater) => (
          <div 
            key={theater.id}
            className={`p-3 rounded border-l-4 flex flex-col gap-2 transition-all hover:bg-white/5 cursor-pointer
              ${theater.status === 'critical' ? 'bg-red-500/5 border-red-500' : (theater.status === 'elevated' ? 'bg-orange-500/5 border-orange-500' : 'bg-white/5 border-gray-700')}`}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold">{theater.name}</span>
              <span className={`text-[10px] font-bold ${theater.status === 'critical' ? 'text-red-500' : (theater.status === 'elevated' ? 'text-orange-500' : 'text-green-500')}`}>
                {theater.status.toUpperCase()}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4 text-[10px] text-gray-400">
                <span className="uppercase tracking-wider w-8">Air</span>
                {theater.air > 0 && (
                  <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded">
                    <span>✈️</span>
                    <span className="text-white font-bold">{theater.air}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-[10px] text-gray-400">
                <span className="uppercase tracking-wider w-8">Sea</span>
                {theater.naval > 0 && (
                  <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded">
                    <span>🛳️</span>
                    <span className="text-white font-bold">{theater.naval}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
              <span>+</span>
              <span>stable</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center px-3 py-2 border-t border-white/5 text-[9px] text-gray-500 bg-black/20">
         <span>DATA REFRESH: {new Date(timestamp).toLocaleTimeString()}</span>
         <button className="hover:text-white transition-colors" onClick={() => setLoading(true)}>↻</button>
      </div>
    </div>
  );
}
