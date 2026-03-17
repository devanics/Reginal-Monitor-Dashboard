"use client";

import React, { useState, useEffect } from 'react';
import Sparkline from './Sparkline';

export default function MarketsWidget() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const res = await fetch('/api/markets');
        const json = await res.json();
        if (json.quotes) setData(json.quotes);
      } catch (error) {
        console.error("Failed to fetch markets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkets();
    const interval = setInterval(fetchMarkets, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div className="widget-card animate-pulse h-60 bg-white/5"></div>;

  return (
    <div className="flex flex-col gap-2 bg-gray-900 h-60 rounded-lg p-1 overflow-hidden">
      <div className="flex justify-between items-center px-2 py-1">
        <div className="flex items-center gap-2">
            <h2 className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">Markets</h2>
            <span className="text-gray-500 text-[10px] cursor-help">ⓘ</span>
        </div>
        <button className="text-[9px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase hover:bg-white/10 transition-colors">
            Watchlist
        </button>
      </div>
      
      <div className="bg-[#111111] border border-white/5 rounded-lg flex flex-col overflow-y-auto flex-1 custom-scrollbar">
        {data.map((item, index) => {
          const isPositive = item.change >= 0;
          const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
          const strokeColor = isPositive ? '#22c55e' : '#ef4444';

          return (
            <div key={item.symbol} className={`p-3 flex items-center justify-between hover:bg-white/5 transition-colors ${index !== data.length - 1 ? 'border-b border-white/5' : ''}`}>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">{item.name}</span>
                <span className="text-[10px] text-gray-500 font-mono">{item.symbol}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-6 opacity-60">
                   <Sparkline data={item.sparkline} color={strokeColor} />
                </div>
                <div className="flex flex-col items-end min-w-[80px]">
                  <span className="text-sm font-mono font-bold text-white">
                    ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`text-[11px] font-mono font-bold ${colorClass}`}>
                    {isPositive ? '+' : ''}{item.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
