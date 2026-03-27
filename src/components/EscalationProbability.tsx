"use client";

import React, { useState, useEffect } from 'react';

export default function EscalationProbability() {
  const [data, setData] = useState({ probability: 74, yes: 74, no: 26 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProbability = async () => {
      try {
        const res = await fetch('/api/escalation-probability');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch escalation probability:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProbability();
    const interval = setInterval(fetchProbability, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 border-l border-white/10 shrink-0">
      <span className="text-gray-500 uppercase tracking-widest text-[10px]">Predictions:</span>
      <div className="flex items-center gap-2">
        <span className="text-white text-[10px] uppercase font-bold whitespace-nowrap">Regional Escalation Probability</span>
        <div className="flex h-6 items-stretch border border-black overflow-hidden rounded-sm w-[350px] shrink-0">
          <div 
            className="bg-[#2d5a27] flex items-center justify-center px-2 transition-all duration-1000 whitespace-nowrap min-w-[60px]"
            style={{ width: `${data.yes}%` }}
          >
            <span className="text-[10px] text-white font-bold opacity-90">Yes ({data.yes}%)</span>
          </div>
          <div 
            className="bg-[#8b0000] flex items-center justify-center px-2 transition-all duration-1000 whitespace-nowrap flex-grow"
          >
            <span className="text-[10px] text-white font-bold opacity-90">No ({data.no}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
