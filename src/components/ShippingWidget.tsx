'use client';

import { useEffect, useState } from 'react';
import Sparkline from './Sparkline';

export default function ShippingWidget() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/shipping')
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((json) => {
        if (json.indices) setData(json.indices);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-3 bg-card rounded-lg border border-border animate-pulse h-48"></div>;
  if (error) return <div className="p-3 bg-card rounded-lg border border-border text-red-400 text-[10px]">API key missing</div>;

  return (
    <div className="flex flex-col gap-2 bg-gray-900 h-40 overflow-scroll rounded-lg p-1">
      <h2 className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase px-1">Shipping</h2>
      <div className="flex flex-col gap-2 flex-grow">
        {data.map((item) => {
          const isPositive = item.changePct >= 0;
          const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
          const strokeColor = '#3b82f6';
          const arrow = isPositive ? '▲' : '▼';

          return (
            <div key={item.id} className="bg-card border border-border rounded-lg p-3 flex flex-col justify-between hover:bg-card-hover transition-colors flex-grow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <span className="font-bold text-xs leading-tight w-24 truncate">{item.name.replace(' Producer Price Index', '')}</span>
                  <span className="text-[8px] text-gray-500 mt-0.5">Price Index</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black leading-none mb-1">{item.currentValue.toFixed(1)}</span>
                  <span className={`text-[9px] font-bold ${colorClass} flex items-center gap-0.5`}>
                    <span className="text-[7px]">{arrow}</span> {Math.abs(item.changePct).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-full h-8 mt-1">
                {item.history && <Sparkline data={item.history} color={strokeColor} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
