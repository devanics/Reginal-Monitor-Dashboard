'use client';

import { useEffect, useState } from 'react';
import Sparkline from './Sparkline';

export default function CommoditiesWidget() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/commodities')
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
      <h2 className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase px-1">Commodities</h2>
      <div className="grid grid-cols-2 gap-2">
        {data.map((item) => {
          const isPositive = item.change >= 0;
          const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
          const strokeColor = isPositive ? '#4ade80' : '#f87171';

          return (
            <div key={item.symbol} className="bg-card border border-border rounded-lg p-2.5 flex flex-col justify-between hover:bg-card-hover transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-gray-400">{item.symbol}</span>
                <div className="w-12 h-5">
                  {item.sparkline && <Sparkline data={item.sparkline} color={strokeColor} />}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight">${item.price.toFixed(1)}</span>
                <span className={`text-[10px] ${colorClass} font-bold`}>
                  {isPositive ? '+' : ''}{item.change.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
