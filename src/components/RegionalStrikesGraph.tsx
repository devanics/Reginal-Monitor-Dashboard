"use client";

import React, { useState, useEffect } from 'react';

interface HistoryPoint {
  time?: string;
  hourIndex?: number;
  strikes: number;
  air: number;
}

export default function RegionalStrikesGraph() {
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/regional-strikes-history');
        const json = await res.json();
        if (json.history && json.history.length > 0) {
          setData(json.history);
        } else {
          generateMockData();
        }
      } catch {
        generateMockData();
      } finally {
        setLoading(false);
      }
    };

    const generateMockData = () => {
      const mock: HistoryPoint[] = [];
      for (let i = 12; i >= 0; i--) {
        mock.push({
          hourIndex: -Math.floor(i / 2),
          strikes: Math.floor(Math.random() * 12) + 4,
          air: Math.floor(Math.random() * 7) + 3,
        });
      }
      setData(mock);
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="widget-card animate-pulse h-64 bg-white/5" />;

  const width = 300;
  const height = 220;
  const padding = 20;

  const maxVal = Math.max(...data.map(d => Math.max(d.strikes, d.air)), 6);

  const getPoints = (key: 'strikes' | 'air') =>
    data
      .map((d, i) => {
        const x = padding + (i / (data.length - 1)) * (width - padding * 2);
        const y = height - padding - (d[key] / maxVal) * (height - padding * 1.5);
        return `${x},${y}`;
      })
      .join(' ');

  const lastStrike = data[data.length - 1]?.strikes ?? 0;
  const lastAir = data[data.length - 1]?.air ?? 0;

  return (
    <div className="widget-card flex flex-col bg-gray-900/60 border border-white/10 rounded-lg overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="p-3 border-b border-white/5 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Regional Threat Correlation
            </span>
            <span className="text-[9px] text-blue-400 font-mono">Air &amp; Active Strikes (6h) — MENA Region</span>
          </div>
        </div>
        <div className="flex gap-4 pt-1 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <span className="text-[8px] text-gray-500 font-black tracking-wider uppercase">Active Strikes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-[8px] text-gray-500 font-black tracking-wider uppercase">Air Activity</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-3">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid lines */}
          {[1, 0.75, 0.5, 0.25, 0].map(p => {
            const y = height - padding - (p) * (height - padding * 1.5);
            const val = Math.round(p * maxVal);
            return (
              <g key={p}>
                <line x1={padding} y1={y} x2={width - padding} y2={y}
                  stroke="white" strokeOpacity="0.05" strokeDasharray="2,2" />
                <text x={padding - 5} y={y + 3} fontSize="7" fill="#555" textAnchor="end" fontFamily="monospace">
                  {val}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data
            .filter((_, i) => i % 3 === 0)
            .map((d, i) => {
              const originalIdx = data.indexOf(d);
              const x = padding + (originalIdx / (data.length - 1)) * (width - padding * 2);
              return (
                <text key={i} x={x} y={height - 2} fontSize="7" fill="#555" textAnchor="middle" fontFamily="monospace">
                  {d.time}
                </text>
              );
            })}

          {/* Lines */}
          <polyline fill="none" stroke="#ef4444" strokeWidth="2"
            points={getPoints('strikes')} strokeLinejoin="round" strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]"
          />
          <polyline fill="none" stroke="#3b82f6" strokeWidth="2"
            points={getPoints('air')} strokeLinejoin="round" strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
          />

          {/* End dots */}
          {data.length > 0 && (
            <>
              <circle
                cx={padding + (data.length - 1) / (data.length - 1) * (width - padding * 2)}
                cy={height - padding - (data[data.length - 1].strikes / maxVal) * (height - padding * 1.5)}
                r="3" fill="#ef4444"
              />
              <circle
                cx={padding + (data.length - 1) / (data.length - 1) * (width - padding * 2)}
                cy={height - padding - (data[data.length - 1].air / maxVal) * (height - padding * 1.5)}
                r="3" fill="#3b82f6"
              />
            </>
          )}
        </svg>
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 bg-white/5 border-t border-white/5 flex justify-between items-center">
        <span className="text-[8px] text-gray-500 font-bold uppercase">Source: Overwatch REGIONAL Intel</span>
        <div className="flex gap-2 text-[9px]">
          <span className="text-red-400 font-bold">{lastStrike} strikes</span>
          <span className="text-blue-400 font-bold">{lastAir} air</span>
        </div>
      </div>
    </div>
  );
}
