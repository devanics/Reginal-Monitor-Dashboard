'use client';

import { useEffect, useState } from 'react';
import Sparkline from './Sparkline';

export default function CryptoWidget() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/crypto')
      .then((res) => res.json())
      .then((json) => {
        if (json.quotes) setData(json.quotes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-3 bg-card rounded-lg border border-border animate-pulse h-48"></div>;

  return (
    <div className="flex flex-col gap-2 bg-gray-900 overflow-scroll rounded-lg p-1">
      <h2 className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase px-1">Crypto</h2>
      <div className="bg-card border border-border rounded-lg flex flex-col overflow-hidden">
        {data.map((item, index) => {
          const isPositive = item.change >= 0;
          const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
          const strokeColor = isPositive ? '#4ade80' : '#f87171';

          return (
            <div key={item.symbol} className={`p-2.5 flex items-center justify-between hover:bg-card-hover transition-colors ${index !== data.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-none mb-1">{item.symbol}</span>
                <span className="text-[9px] text-gray-500 truncate w-12 uppercase">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-5">
                   <Sparkline data={item.sparkline} color={strokeColor} />
                </div>
                <div className="flex flex-col items-end min-w-[70px]">
                  <span className="text-xs font-bold leading-none">${item.price > 1000 ? item.price.toLocaleString(undefined, {maximumFractionDigits: 0}) : item.price.toFixed(2)}</span>
                  <span className={`text-[9px] font-bold ${colorClass}`}>
                    {isPositive ? '+' : ''}{item.change.toFixed(1)}%
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
