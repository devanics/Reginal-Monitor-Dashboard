"use client";

import React, { useState, useEffect } from 'react';

interface Airport {
  code: string;
  name: string;
  status: string;
}

export default function RegionalAirportsWidget() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAirports = () => {
      fetch('/api/airports-status')
        .then(res => res.json())
        .then(data => {
          if(data.airports) setAirports(data.airports);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    fetchAirports();
    const interval = setInterval(fetchAirports, 60000); // 1m refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="widget-card p-3 animate-pulse bg-white/5 h-36" />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'text-green-500';
      case 'DELAYS': return 'text-yellow-500';
      case 'RESTRICTED': case 'CLOSED': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="widget-card p-3">
      <span className="text-[10px] font-bold uppercase text-gray-500 block mb-3">Regional Major Airports</span>
      <div className="flex flex-col gap-2.5">
        {airports.map(airport => (
          <div key={airport.code} className="flex justify-between items-center text-[11px] border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
            <div className="flex gap-1.5 items-center">
              <span className="font-bold text-gray-300 w-8">{airport.code}</span>
              <span className="text-gray-500 hidden sm:inline">({airport.name})</span>
            </div>
            <span className={`font-bold ${getStatusColor(airport.status)} tracking-wide`}>
              {airport.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
