"use client";

import React, { useState, useEffect } from 'react';

export default function HormuzStatusWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      console.log("Fetching Hormuz status from server...");
      fetch('/api/hormuz-status')
        .then(res => res.json())
        .then(json => {
          console.log("Hormuz data received:", json);
          setData(json);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Hormuz fetch error:", err);
          setLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="widget-card p-3 animate-pulse bg-white/5 h-[88px] border-red-900/50" />;

  const getStatusColor = (status: string) => {
    if (status === 'CLEAR') return 'bg-green-500';
    if (status === 'RESTRICTED') return 'bg-red-500 shadow-[0_0_8px_red]';
    return 'bg-orange-500 shadow-[0_0_8px_orange]';
  };

  return (
    <div className={`widget-card p-3 ${data?.status === 'CLEAR' ? 'bg-green-950/10 border-green-900/20' : 'bg-red-950/20 border-red-900/50'}`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-[10px] font-bold uppercase ${data?.status === 'CLEAR' ? 'text-green-500' : 'text-red-400'}`}>Strait of Hormuz Status</span>
        <span className={`text-[9px] text-white px-2 py-0.5 rounded ${getStatusColor(data?.status)} font-bold tracking-wider`}>
          {data?.status || 'UNKNOWN'}
        </span>
      </div>
      <div className="text-[11px] text-gray-400">
        {data?.description || 'Awaiting maritime status update...'}
      </div>
    </div>
  );
}
